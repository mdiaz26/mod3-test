class Budget < ApplicationRecord
    has_many :line_items
    has_many :comments, through: :line_items
end
