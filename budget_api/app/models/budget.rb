class Budget < ApplicationRecord
    has_many :line_items, :dependent => :destroy
    has_many :comments, through: :line_items, :dependent => :destroy
end
