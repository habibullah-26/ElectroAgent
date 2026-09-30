// ==========================================
// Transaction Functions
// ==========================================

const transactions = require("../localData/transactions.json");


// ==========================================
// Get Transaction Status
// ==========================================

function getTransactionStatus(transactionId) {

  console.log(
    "Executing getTransactionStatus:",
    transactionId
  );

  const transaction = transactions.find(
    transaction =>
      transaction.transactionId === String(transactionId)
  );

  if (!transaction) {

    return {
      success: false,
      message:
        `Transaction ${transactionId} was not found.`
    };

  }

  return {
    success: true,
    transaction: transaction
  };

}


// ==========================================
// Get Transactions By User
// ==========================================

function getTransactionsByUser(userId) {

  console.log("Executing getTransactionsByUser:", userId);

  const matchingTransactions = transactions.filter(
    transaction => transaction.userId === Number(userId)
  );

  return {
    success: true,
    transactions: matchingTransactions
  };

}


// ==========================================
// Export
// ==========================================

module.exports = {
  getTransactionStatus,
  getTransactionsByUser
};