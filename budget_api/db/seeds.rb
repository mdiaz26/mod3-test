# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
Budget.destroy_all
LineItem.destroy_all
Comment.destroy_all

budget1 = Budget.create(name: "Luncheon", total_amount: 150)
budget2 = Budget.create(name: "Wedding", total_amount: 150000)

LineItem1 = LineItem.create(name: "plates", budget: budget1, amount:150, status:"Accepted")
LineItem2 = LineItem.create(name: "forks", budget: budget1, amount:1050, status:"Accepted")
LineItem3 = LineItem.create(name: "spoons", budget: budget1, amount:1530, status:"Accepted")
LineItem4 = LineItem.create(name: "knives", budget: budget1, amount:1250, status:"Accepted")

Comment1 = Comment.create(line_item: LineItem1, body:"I AM THE BODY OF THE COMMENT!!!!")
