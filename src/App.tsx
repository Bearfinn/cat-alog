import { useMemo, useState } from "react";
import "./App.css";
import AddDialog from "./components/app/add-dialog";
import { Button } from "./components/ui/button";
import { Checkbox } from "./components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./components/ui/table";
import { Expense } from "./types/expense";

function App() {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const [selectedExpenses, setSelectedExpenses] = useState<Expense[]>([]);

  const onSubmit = (data: Expense) => {
    setExpenses((expenses) => [
      ...expenses,
      { createdAt: new Date().toISOString(), ...data },
    ]);
    setShowAddDialog(false);
  };

  const handleDelete = () => {
    setExpenses((expenses) => {
      const result = expenses.filter((expense) => {
        return !selectedExpenses.find(
          (selectedExpense) => selectedExpense.createdAt === expense.createdAt
        );
      });
      return result;
    });
  };

  const expenseByCategory = useMemo(() => {
    const result = [];
    /*
     Sum expenses in each category
     */
    for (const expense of expenses) {
      const index = result.findIndex(
        (item) => item.category === expense.category
      );
      if (index === -1) {
        result.push({ category: expense.category, amount: expense.amount });
      } else {
        result[index].amount += expense.amount;
      }
    }

    return result;
  }, [expenses]);

  const topCategories = useMemo(() => {
    let maxAmount = 0;
    let result: string[] = [];
    for (const expenseGroup of expenseByCategory) {
      if (expenseGroup.amount > maxAmount) {
        maxAmount = expenseGroup.amount;
        result = [expenseGroup.category];
      }
      if (expenseGroup.amount === maxAmount) {
        result.push(expenseGroup.category);
      }
    }
    return result;
  }, [expenseByCategory]);

  console.log(expenseByCategory);

  return (
    <div className="container mx-auto max-w-4xl mt-8">
      <div className="flex justify-between">
        <div className="text-2xl">Cat expense book</div>
        <div className="flex gap-2">
          <Button
            className="bg-red-500 hover:bg-red-400"
            onClick={() => handleDelete()}
            disabled={selectedExpenses.length < 1}
          >
            Delete expense
          </Button>
          <Button onClick={() => setShowAddDialog(true)}>Add expense</Button>
        </div>
      </div>

      <div className="mt-8">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead>Item</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.length === 0 && (
              <TableRow className="h-40 text-slate-500">
                <TableCell colSpan={4} className="text-center">
                  <div>
                    <div>
                      Start creating expenses by clicking the "Add expense"
                      button
                    </div>
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => setShowAddDialog(true)}
                    >
                      Add expense
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
            {expenses.length > 0 &&
              expenses.map((expense) => {
                return (
                  <TableRow
                    key={expense.createdAt}
                    className={
                      topCategories.includes(expense.category)
                        ? "bg-yellow-100"
                        : ""
                    }
                  >
                    <TableCell>
                      <Checkbox
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedExpenses((selectedExpenses) => [
                              ...selectedExpenses,
                              expense,
                            ]);
                            return;
                          }
                          const index = selectedExpenses.findIndex(
                            (_expense) =>
                              _expense.createdAt === expense.createdAt
                          );
                          setSelectedExpenses((selectedExpenses) => {
                            selectedExpenses.splice(index, 1);
                            return [...selectedExpenses];
                          });
                        }}
                      />
                    </TableCell>
                    <TableCell>{expense.item}</TableCell>
                    <TableCell>
                      <div className="relative inline">
                        {expense.category}
                        {topCategories.includes(expense.category) && (
                          <div className="absolute -right-14 -top-4 text-xs bg-yellow-300 px-2 py-1 text-black rounded-sm">
                            Top 👑
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {new Intl.NumberFormat().format(expense.amount)}
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </div>

      <AddDialog
        onCreate={onSubmit}
        open={showAddDialog}
        onOpenChange={() => setShowAddDialog(false)}
      />
    </div>
  );
}

export default App;
