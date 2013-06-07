class HomeController < ApplicationController
  def index
    unless cookies[:lat] && cookies[:lon]
      params[:lat] = 44.979971
      params[:lon] = -93.269797
    else 
      params[:lat] = cookies[:lat]
      params[:lon] = cookies[:lon]
    end
    params[:radius] = 1

    if !params[:q].present? && cookies[:q].present?
      params[:q]=cookies[:q]
    end

    @stops = Stop.search(params)
    @lat=params[:lat]
    @lon=params[:lon]
  end

  def about

  end
  
  def feedback
    
  end
end
