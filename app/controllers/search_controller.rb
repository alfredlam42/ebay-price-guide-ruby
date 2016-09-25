class SearchController < ApplicationController
  def index()
  end

  def create()

    response = Search.doSearch(params[:item], params[:completed], params[:retailPrice], params[:auctionType])

    render plain: response.to_json
  end
end
