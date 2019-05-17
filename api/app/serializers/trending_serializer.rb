# frozen_string_literal: true

class TrendingSerializer
  include FastJsonapi::ObjectSerializer
  set_id :object_id

  ['author', 'name', 'url', 'description', 'language', 'languageColor',
   'stars', 'forks', 'currentPeriodStars'].each do |name|
    attributes name do |obj|
      obj[name]
    end
  end

  attribute :builtBy do |obj|
    OwnerSerializer.new(obj['builtBy'])
  end
end
