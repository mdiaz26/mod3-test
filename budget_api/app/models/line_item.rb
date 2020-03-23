class LineItem < ApplicationRecord
  belongs_to :budget
  has_many :comments, :dependent => :destroy
end
