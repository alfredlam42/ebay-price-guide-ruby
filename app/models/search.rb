class Search < ApplicationRecord
  def self.doSearch(item, completed, retailPrice, auctionType)
    filterCount = 1

    item = item.split(' ').join('+')
    #starting path
    path = 'http://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME='

    path += completed ? 'findCompletedItems' : 'findItemsByKeywords'

    path += '&SERVICE-VERSION=1.7.0'
    path += '&SECURITY-APPNAME=' + ENV['DEV_ID']
    path += '&RESPONSE-DATA-FORMAT=XML'
    path += '&REST-PAYLOAD'
    path += '&keywords=' + item
    path += '&itemFilter(0).name=MinPrice'
    path += '&itemFilter(0).value='
    path += retailPrice.to_i > 0 ? retailPrice : '0'
    path += '&itemFilter(0).paramName=Currency'
    path += '&itemFilter(0).paramValue=USD'

    if completed
      path += "&itemFilter(#{filterCount}).name=SoldItemsOnly"
      path += "&itemFilter(#{filterCount}).value=true"
      filterCount += 1
    end

    if auctionType
      path += "&itemFilter(#{filterCount}).name=ListingType"
      path += "&itemFilter(#{filterCount}).value=#{auctionType}"
      filterCount += 1
    end

    path += completed ? "&sortOrder=StartTimeNewest" : "&sortOrder=PricePlusShippingLowest"
    path += '&paginationInput.entriesPerPage=50'

    response = HTTParty.get(path)

    return response
  end
end