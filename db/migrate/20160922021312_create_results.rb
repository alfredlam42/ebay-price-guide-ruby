class CreateResults < ActiveRecord::Migration[5.0]
  def change
    create_table :results do |t|
      t.json :result
      t.string :search_params
      t.integer :user_id
      t.integer :parent_result_id
      t.integer :child_result_id

      t.timestamps
    end
  end
end
