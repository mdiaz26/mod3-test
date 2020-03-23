class CreateBudgets < ActiveRecord::Migration[6.0]
  def change
    create_table :budgets do |t|
      t.string :name
      t.integer :total_amount

      t.timestamps
    end
  end
end
