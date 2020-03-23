require 'test_helper'

class BudgetsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @budget = budgets(:one)
  end

  test "should get index" do
    get budgets_url, as: :json
    assert_response :success
  end

  test "should create budget" do
    assert_difference('Budget.count') do
      post budgets_url, params: { budget: { name: @budget.name, total_amount: @budget.total_amount } }, as: :json
    end

    assert_response 201
  end

  test "should show budget" do
    get budget_url(@budget), as: :json
    assert_response :success
  end

  test "should update budget" do
    patch budget_url(@budget), params: { budget: { name: @budget.name, total_amount: @budget.total_amount } }, as: :json
    assert_response 200
  end

  test "should destroy budget" do
    assert_difference('Budget.count', -1) do
      delete budget_url(@budget), as: :json
    end

    assert_response 204
  end
end
