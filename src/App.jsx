import React, { useState, useEffect} from 'react'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { Guitar } from './components/Guitar'
import { db } from './data/db'

export const App = () => {
    //Persistencia en el localStorage
    function initialCart(){
      const localStorageCart = localStorage.getItem('cart')
      return localStorageCart ? JSON.parse(localStorageCart): []
    }
    const [data, setData] = useState(db);
    const [cart, setCart] = useState(initialCart)
    useEffect(()=>{
      localStorage.setItem('cart', JSON.stringify(cart))
    }, [cart])
    
    //Agregar al carrito
    function addToCart(guitar){
      const itemIndex = cart.findIndex((item) => guitar.id===item.id)
      if (itemIndex===-1){
        //Ese articulo aun no existe en el carrito
        guitar.quantity=1;
        setCart([...cart, guitar])
      }
      else{
        //Si la guitarra ya se habia añadido al carrito
        const updatedCart = [...cart] //Creando una copia de la variable de estado
        updatedCart[itemIndex].quantity++;
        setCart(updatedCart);
      }
    }

    //Calcular el total del carrito
    function calculateTotal(){
      /*let total = 0
      for (const guitar of cart) {
        total += guitar.price * guitar.quantity;
      }*/

        let total = cart.reduce((total, item) => total + item.price * item.quantity, 0)
      return total;
    }

    //Ejercicio - Restar una guitarra del carrito desde el boton "-"
    function removeOneGuitar(id){
      const updatedCart = cart.map(item =>
        item.id === id
          ? { ...item, quantity: item.quantity - 1 }
          : item
      ).filter(item => item.quantity > 0);
      setCart(updatedCart);
    }

    //Ejercicio - Añadir una guitarra al carrito desde el boton de "+"
    function addOneGuitar(id) {
      const updatedCart = cart.map(item =>
        item.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      setCart(updatedCart);
    }    

    //Ejercicio - Quitar la guitarra completa del carrito
    function removeGuitar(id){
      const removeFromCart = cart.filter(item => item.id !== id)
      setCart(removeFromCart)
    }

    //Ejercicio - Vaciar el carrito 
    function emptyCart(){
      let copiaCart = [...cart]
      copiaCart = []
      setCart(copiaCart)
    }

    return (
    <>
      <Header cart={cart} total={calculateTotal()} addOneGuitar={addOneGuitar} 
              removeOneGuitar={removeOneGuitar} removeGuitar={removeGuitar}
              emptyCart={emptyCart}/>
      <main className="container-xl mt-5">
        <h2 className="text-center">Nuestra Colección</h2>
          <div className="row mt-5">
            {data.map((guitar) => (
              <Guitar guitar={guitar} key={guitar.id} addToCart={addToCart}/>
            ))}
          </div>
      </main>
      <Footer/>
    </>
  )
}
