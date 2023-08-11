/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useContext, useState, useEffect } from 'react'
import {
  List,
  User,
  ShoppingBag,
  Briefcase,
  Server,
  Settings,
} from 'react-feather'
import { toast } from 'react-hot-toast'

const Context = createContext()

let initialCartState = []
let shippingData = {}
let paymentData = ''
let initialUser = ''

export const StateContext = ({ children }) => {
  const [bagItems, setBagItems] = useState(initialCartState)
  const [show, setShow] = useState(false)
  const [shippingDetails, setShippingDetails] = useState(shippingData)
  const [paymentMethod, setPaymentMethod] = useState(paymentData)
  const [currentUser, setCurrentUser] = useState(initialUser)

  useEffect(() => {
    const getUser = JSON.parse(localStorage.getItem('userinfo'))
    if (getUser) {
      setCurrentUser(getUser)
    }
  }, [])

  useEffect(() => {
    // Persist state changes to localStorage
    if (currentUser !== initialUser) {
      localStorage.setItem('userinfo', JSON.stringify(currentUser))
    }
  }, [currentUser])

  //save bag to localstoroage
  useEffect(() => {
    const bagData = JSON.parse(localStorage.getItem('updatedBag'))
    if (bagData) {
      setBagItems(bagData)
    }
  }, [])

  useEffect(() => {
    if (bagItems !== initialCartState) {
      localStorage.setItem('updatedBag', JSON.stringify(bagItems))
    }
  }, [bagItems])

  //get shippingdetails
  useEffect(() => {
    const shipForm = JSON.parse(localStorage.getItem('shippingDetails'))
    if (shipForm) {
      setShippingDetails(shipForm)
    }
  }, [])

  useEffect(() => {
    if (shippingDetails !== shippingData) {
      localStorage.setItem('shippingDetails', JSON.stringify(shippingDetails))
    }
  }, [shippingDetails])

  //get payment method
  useEffect(() => {
    const paymentType = JSON.parse(localStorage.getItem('paymentType'))
    if (paymentType) {
      setPaymentMethod(paymentType)
    }
  }, [])

  useEffect(() => {
    if (paymentMethod !== paymentData) {
      localStorage.setItem('paymentType', JSON.stringify(paymentMethod))
    }
  }, [paymentMethod])

  const increaseBagQuantity = (id) => {
    setBagItems((currItems) => {
      if (currItems.find((item) => item._id === id._id) == null) {
        return [...currItems, { ...id, quantity: 1 }]
      } else {
        return currItems.map((item) => {
          if (item._id === id._id) {
            return { ...item, quantity: item.quantity + 1 }
          } else {
            return item
          }
        })
      }
    })
  }

  const decreaseBagQuantity = (id) => {
    setBagItems((currItems) => {
      if (currItems.find((item) => item._id === id._id)?.quantity === 1) {
        return currItems.filter((item) => item._id !== id._id)
      } else {
        return currItems.map((item) => {
          if (item._id === id._id) {
            return { ...item, quantity: item.quantity - 1 }
          } else {
            return item
          }
        })
      }
    })
  }

  const priceTotal = bagItems.reduce(
    (total, item) => total + item.quantity * item.price,
    0
  )
  const bagQuantity = bagItems?.reduce(
    (quantity, item) => item.quantity + quantity,
    0
  )
  const removeFromBag = (id) => {
    setBagItems((currItems) => {
      return currItems.filter((item) => item._id !== id)
    })
  }

  const sortMethods = {
    asc: {
      method: (a, b) => (a.title < b.title ? -1 : a.title > b.title ? 1 : 0),
    },
    desc: {
      method: (a, b) => (a.title < b.title ? 1 : a.title > b.title ? -1 : 0),
    },
    low: {
      method: (a, b) => (a.price < b.price ? -1 : a.price > b.price ? 1 : 0),
    },
    high: {
      method: (a, b) => (a.price < b.price ? 1 : a.price > b.price ? -1 : 0),
    },
  }

  const LogOut = () => {
    localStorage.removeItem('userinfo')
    location.replace('/')
    toast.success('Logged out successfully')
  }

  const links = [
    {
      name: 'Orders',
      path: `${currentUser?.user?.username}/orders`,
      icon: <List />,
    },
    {
      name: 'Profile',
      path: `user-profile/${currentUser?.user?.username}`,
      icon: <User />,
    },
    {
      name: 'Wishlist',
      path: `${currentUser?.user?.username}/wishlist`,
      icon: <ShoppingBag />,
    },
  ]

  const adminLinks = [
    {
      name: 'Shop orders',
      path: 'allorders',
      icon: <Briefcase />,
    },
    {
      name: 'Manage product',
      path: 'manage-product',
      icon: <Settings />,
    },
    {
      name: 'Add product',
      path: 'add-new-product',
      icon: <Server />,
    },
  ]

  return (
    <Context.Provider
      value={{
        currentUser,
        setCurrentUser,
        sortMethods,
        bagItems,
        setBagItems,
        bagQuantity,
        increaseBagQuantity,
        decreaseBagQuantity,
        removeFromBag,
        priceTotal,
        show,
        setShow,
        setShippingDetails,
        shippingDetails,
        paymentMethod,
        setPaymentMethod,
        links,
        adminLinks,
        LogOut,
      }}
    >
      {children}
    </Context.Provider>
  )
}

export const useStore = () => useContext(Context)
