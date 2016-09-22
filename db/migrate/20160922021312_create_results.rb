class CreateResults < ActiveRecord::Migration[5.0]
  def change
    create_table :results do |t|
      t.json :result
      t.string :searchParams
      t.integer :user_id

      t.timestamps
    end
  end
end
