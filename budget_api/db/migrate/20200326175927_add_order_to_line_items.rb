class AddOrderToLineItems < ActiveRecord::Migration[6.0]
  def change
    add_column :line_items, :order, :integer
  end
end
