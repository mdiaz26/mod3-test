class CreateLineItems < ActiveRecord::Migration[6.0]
  def change
    create_table :line_items do |t|
      t.references :budget, null: false, foreign_key: true
      t.float :amount
      t.string :status

      t.timestamps
    end
  end
end
