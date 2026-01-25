import { useState } from 'react'
import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ¡Tailwind funciona! 🎉
          </h1>
          <p className="text-gray-600">
            Tu proyecto con estilos profesionales
          </p>
          <button className="mt-4 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors">
            Empezar
          </button>
        </div>
      </div>
    </div>
  );
}
export default App
