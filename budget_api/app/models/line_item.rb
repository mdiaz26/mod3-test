class LineItem < ApplicationRecord
  belongs_to :budget
  has_many :comments, :dependent => :destroy
  before_create :add_order

  def add_order
    self.order = self.budget.line_items.count + 1
  end
end
