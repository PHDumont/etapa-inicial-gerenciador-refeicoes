interface Food {
  _id: string;
  name: string;
  caloriesPerGram: number;
  category: string;
}

interface FoodCatalogyProps {
  foods: Food[];
  loadFoods: () => Promise<void>;
}

export function FoodCatalogy({ foods, loadFoods }: FoodCatalogyProps) {
  return (
    <main className="main-content">
      <div className="page-header">
        <h2>Catálogo Completo</h2>
        <button
          style={{
            backgroundColor: "#18987B",
            color: "white",
            padding: "0.8rem 1.5rem",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          + Novo Alimento
        </button>
      </div>

      <div className="food-grid">
        {foods.map((food) => (
          <div key={food._id} className="food-card">
            <h3>{food.name}</h3>
            <p>{food.caloriesPerGram} kcal/g</p>
            <p>{food.category}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
