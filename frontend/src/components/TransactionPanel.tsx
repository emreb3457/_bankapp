import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../api';

interface Person {
  id: number;
  name: string;
  surname?: string;
}

interface TransactionResult {
  personId: number;
  amount: number;
  status: string;
  error?: string;
}

interface TransactionHistoryItem {
  id: number;
  person: Person;
  amount: number;
  status: string;
  createdAt: string;
}

const TransactionPanel = () => {
  const [persons, setPersons] = useState<Person[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [amounts, setAmounts] = useState<{ [id: string]: string }>({});
  const [balance, setBalance] = useState<number>(0);
  const [results, setResults] = useState<TransactionResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<TransactionHistoryItem[]>([]);
  const [batchTime, setBatchTime] = useState<number | null>(null);

  useEffect(() => {
    api.get('/persons')
      .then(res => setPersons(res.data))
      .catch(() => toast.error('Failed to fetch persons.'));
    fetchBalance();
    fetchHistory();

    const interval = setInterval(() => {
      fetchBalance();
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const fetchBalance = async () => {
    try {
      const res = await api.get('/bank/balance');
      setBalance(Number(res.data.balance));
    } catch {
      toast.error('Failed to fetch bank balance.');
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await api.get('/transactions');
      setHistory(res.data);
    } catch {
      toast.error('Failed to fetch transaction history.');
    }
  };

  const handleAmountChange = (id: string, value: string) => {
    setAmounts(prev => ({ ...prev, [id]: value }));
  };

  const handleCheckboxChange = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    setLoading(true);
    setResults([]);
    setBatchTime(null);
    try {
      const transactions = selectedIds.map(id => ({
        personId: Number(id),
        amount: Number(amounts[id] || 0),
      }));
      const start = performance.now();
      const res = await api.post('/transactions', { transactions });
      const end = performance.now();
      setBatchTime(end - start);
      setResults(res.data);
      fetchBalance();
      fetchHistory();
      toast.success('Transactions completed.');
    } catch (e) {
      toast.error('An error occurred.');
    }
    setLoading(false);
  };

  return (
    <div className="panel-container">
      <h2>Bank Balance: <span className="balance">${balance}</span></h2>
      <hr />
      <div className="section-title">Persons</div>
      <div>
        {persons.map(person => (
          <div key={person.id} className="person-row">
            <input
              type="checkbox"
              checked={selectedIds.includes(person.id.toString())}
              onChange={() => handleCheckboxChange(person.id.toString())}
            />
            <span className="person-name">{person.name} {person.surname}</span>
            {selectedIds.includes(person.id.toString()) && (
              <input
                type="number"
                placeholder="Amount"
                className="amount-input"
                value={amounts[person.id] || ''}
                onChange={e => handleAmountChange(person.id.toString(), e.target.value)}
              />
            )}
          </div>
        ))}
      </div>
      <button
        className="send-btn"
        onClick={handleSubmit}
        disabled={loading || selectedIds.length === 0 || selectedIds.some(id => !amounts[id])}
      >
        {loading ? 'Sending...' : 'Send Transactions'}
      </button>
      <hr />
      {results.length > 0 && (
        <div>
          <div className="section-title">Results</div>
          <div>
            {results.map((data, i) => (
              <div key={i} className={data.status === 'success' ? 'result-success' : 'result-failed'}>
                {persons.find(p => p.id === data.personId)?.name}: {data.amount} $ - {data.status === 'success' ? 'Success' : `Failed (${data.error})`}
              </div>
            ))}
          </div>
        </div>
      )}
      <hr />
      <div className="section-title">All Transaction History</div>
      <div className="scroll">
        {history.length === 0 && <div>No transactions yet.</div>}
        {history.map(item => (
          <div key={item.id} className={item.status === 'success' ? 'result-success' : 'result-failed'}>
            {item.person?.name}: {item.amount} $ - {item.status === 'success' ? 'Success' : 'Failed'}
            <span style={{ color: '#888', marginLeft: 8, fontSize: 12 }}>
              ({new Date(item.createdAt).toLocaleString('en-GB')})
            </span>
          </div>
        ))}
      </div>
      {batchTime !== null && (
        <div style={{ margin: '8px 0', color: '#555', fontSize: 14 }}>
          Batch processing time: {batchTime.toFixed(0)} ms
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default TransactionPanel; 