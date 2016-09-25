scheduler = Rufus::Scheduler.new

unless defined?(Rails::Console) || File.split($0).last == 'rake'
  # scheduler.every '3s' do
  #   p 'hi'
  # end
end