# frozen_string_literal: true

class PopularSerializer
  include FastJsonapi::ObjectSerializer
  set_id :object_id

  attribute :value do |obj|
    obj['urlParam']
  end

  attribute :view_value do |obj|
    obj['name']
  end
end
