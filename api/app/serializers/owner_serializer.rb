# frozen_string_literal: true

class OwnerSerializer
  include FastJsonapi::ObjectSerializer
  set_id :object_id

  ['username', 'href', 'avatar'].each do |name|
    attributes name do |obj|
      obj[name]
    end
  end
end
