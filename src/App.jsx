import React from 'react'
import {  Routes, Route } from 'react-router-dom'
import { MyContextProvider } from './Context'
import Header from './components/Header'
import Form from './components/Form'
import BottomNav from './components/BottomNav'
import Asset from './components/Asset'
import Transaction from './components/Transaction'
import Budgets from './components/Budgets'
import Goals from './components/Goals'

const App = () => {
  return (
    <MyContextProvider>
    
        {/* pb-20 reserves space so content never hides behind the bottom nav */}
        <div className="min-h-screen bg-[#F5F3EE] flex flex-col pb-20">
          <Header />
          <Form />
          <main className="flex-1">
            <Routes>
              <Route path="/"             element={<Asset />} />
              <Route path="/transactions" element={<Transaction />} />
              <Route path="/budgets"      element={<Budgets />} />
              <Route path="/goal"         element={<Goals />} />
            </Routes>
          </main>
          <BottomNav />
        </div>
      
    </MyContextProvider>
  )
}

export default App