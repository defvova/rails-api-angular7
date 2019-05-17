# frozen_string_literal: true

class LanguageSerializer
  include FastJsonapi::ObjectSerializer
  set_id :object_id

  attribute :popular do |obj|
    PopularSerializer.new(obj['popular'])
  end

  attribute :all do |obj|
    PopularSerializer.new(obj['all'])
  end
end
