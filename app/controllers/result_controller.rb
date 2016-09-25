class ResultController < ApplicationController
  skip_before_filter :verify_authenticity_token

  def index()
  end

  def create()
    result = Result.create(result: params[:result].to_json, search_params: params[:searchParams], user_id: current_user.id);
    p result
    render plain: 'done'
  end
end
