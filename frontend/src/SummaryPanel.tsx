import "./SummaryPanel.css"

export function SummaryPanel(){
  return (
    <aside className="summary-panel">
      <div className="summary-header">
        <h2>Resumo Diário</h2>
        <p className="summary-date">Quarta, 01 de Janeiro</p>
      </div>

      <div className="summary-card">

        <div className="card-bottom-section">
          <h4>Refeicoes do Dia</h4>
          
          <ul className="meal-list">
            <li className="meal-item">
              <span className="meal-name">Café da Manha</span>
              <span className="meal-calories">350 kcal</span>
            </li>
            <li className="meal-item">
              <span className="meal-name">Almoco</span>
              <span className="meal-calories">650 kcal</span>
            </li>
            <li className="meal-item">
              <span className="meal-name">Lanche</span>
              <span className="meal-calories">150 kcal</span>
            </li>
          </ul>
        </div>
        
      </div>
    </aside>
  );
};