class CreateProviders < ActiveRecord::Migration[5.0]
  def change
    create_table :providers do |t|
      t.integer :uid, null: false
      t.string :name, null: false
      t.references :user, foreign_key: true

      t.timestamps
    end
  end
end
