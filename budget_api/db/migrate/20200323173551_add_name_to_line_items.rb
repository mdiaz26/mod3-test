class AddNameToLineItems < ActiveRecord::Migration[6.0]
  def change
    add_column :line_items, :name, :string
  end
end
