class Result < ApplicationRecord
  belongs_to :user

  def self.updateResult
    results = Result.where(child_result_id: nil)

    results.each do |result|
      params = Hash.new(false);
      search = result.search_params.shift
      search.shift
      #break down search_params
      search.each do |parameter|
        params[parameter.split('=')[0]] = (parameter.split('=')[1])
      end

      #HTTP to do another search
      searchResult = Search.doSearch(params['item'], params['completed'], params['retailPrice'], params['auctionType'])

      #get results and do calculations
      newResult = Result.new()
    end
  end
end
