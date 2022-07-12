const hamburgerCheckbox = document.querySelector('#hamburger-checkbox')
const darkmodeIcon = document.querySelector('.dark-mode-switch')

const shipRadio = document.querySelectorAll('.ship-radio')

const btnPlus = document.querySelectorAll('.button-plus')
const btnMinus = document.querySelectorAll('.button-minus')

const btnPrev = document.querySelector('.button-prev')
const btnNext = document.querySelector('.button-next')

const controller = {
  // 手機版，漢堡排切換顯示 nav
  switchHamburgerCheckbox: function () {
    const nav = document.querySelector('#nav')
    if (nav.classList.contains('checked')) {
      nav.classList.remove('checked')
    } else {
      nav.classList.add('checked')
    }
  },

  // dark mode 
  switchDarkMode: function(event) {
    if (event.target.checked) {
      document.documentElement.setAttribute('data-theme', 'dark')
    } else {
      document.documentElement.setAttribute('data-theme', 'light')
    }
  },

  // 表單下一步操作
  buttonNextStep: function (event) {
    event.preventDefault()
    // 如果點擊時是第 1、2 步，下一步 button 才會有作用
    if ((1 <= model.step) && (model.step < 3)) {
      model.step += 1
      view.setStepCondition()
      view.setFormCondition()
      view.setBtnCondition()
      // 點完後變成第 3 步時，改變下一步 button 的 type 為 sumbit
      if (model.step === 3) {
        btnNext.setAttribute('type', 'sumbit')
      }
    } else if (model.step === 3) {
      // 如果點擊時是第 3 步，則送出表單
      console.log('post form content')
    } else {
      return
    }
  },

  // 表單下一步操作
  buttonPrevStep: function (event) {
    event.preventDefault()
    // 如果點擊時是第 2、3 步，上一步 button 才會有作用
    if ((1 < model.step) && (model.step <= 3)) {
      model.step -= 1
      view.setStepCondition()
      view.setFormCondition()
      view.setBtnCondition()
      if (model.step !== 3) {
        // 如果點擊時不是第 3 步，刪除下一步 button 的 type 的 sumbit
        btnNext.removeAttribute('type', 'submit')
      }
    } else {
      return
    }
  },

  // 增減 item 數量
  buttonItemNum: function (event) {
    // 如果點擊的 button 是 plus
    if (event.target.classList.contains('button-plus')) {
      // 取得目前 ItemNum，加一後再更新回去
      const currentNum = Number(event.target.parentElement.children[1].textContent)
      const updateNum = currentNum + 1

      // 更新畫面上之 ItemNum
      event.target.parentElement.children[1].textContent = updateNum

      // 更新畫面之 Item 總金額
      view.setItemTotalPrice(event, currentNum, updateNum)
    } else if (event.target.classList.contains('button-minus')) {
      // 如果點擊的 button 是 Minus
      // 取得目前 ItemNum，如果目前 ItemNum 是兩個或以上，才減一後再更新回去，否則直接結束函式
      const currentNum = Number(event.target.parentElement.children[1].textContent)
      if (currentNum < 2) {
        return
      }
      const updateNum = currentNum - 1
      event.target.parentElement.children[1].textContent = updateNum
      view.setItemTotalPrice(event, currentNum, updateNum)
    }
  },

  // 選擇商品運送方式
  shipRadio: function (event) {
    // 取得 radio 的 shipPriceDetail
    const shipPriceDetail = event.target.parentElement.children[1].children[1].children[0].textContent

    // 取得購物籃的運費 shipPrice
    const shipPrice = document.querySelector('.ship-price-wrapper').children[1]

    // 將 radio 的 shipPriceDetail 更新到 購物籃的運費 shipPrice
    shipPrice.textContent = shipPriceDetail

    // 重新計算所有物品總金額 + 運費 之總金額，並渲染畫面
    view.setItemsAndShipTotalPrice(model.ItemsTotalPrice)
  }
}

const model = {
  step: 1,
  ItemsTotalPrice: 0,
}

const view = {
  // stepper 各步驟階段呈現狀態
  setStepCondition: function () {
    const circles = document.querySelectorAll('.circle')
    const connectLines = document.querySelectorAll('.connect-line')
    if (model.step === 1) {
      circles[0].classList.add('active')
      circles[0].classList.remove('checked')
      circles[1].classList.remove('active')
      connectLines[0].classList.add('active')
      connectLines[1].classList.remove('active')
    } else if (model.step === 2) {
      circles[0].classList.add('checked')
      circles[0].classList.remove('active')
      circles[1].classList.add('active')
      circles[1].classList.remove('checked')
      circles[2].classList.remove('active')
      connectLines[1].classList.add('active')
    } else if (model.step === 3) {
      circles[1].classList.add('checked')
      circles[1].classList.remove('active')
      circles[2].classList.add('active')
    }
  },

  // 表單內容各階段呈現與隱藏
  setFormCondition: function () {
    const formParts = document.querySelectorAll('.part')
    if (model.step === 1) {
      formParts[0].classList.remove('disabled')
      formParts[1].classList.add('disabled')
    } else if (model.step === 2) {
      formParts[0].classList.add('disabled')
      formParts[1].classList.remove('disabled')
      formParts[2].classList.add('disabled')
    } else if (model.step === 3) {
      formParts[1].classList.add('disabled')
      formParts[2].classList.remove('disabled')
    }
  },

  // 表單按鈕各階段呈現狀態
  setBtnCondition: function () {
    if (model.step === 1) {
      btnPrev.setAttribute('disabled', 'disabled')
    } else if (model.step === 2) {
      btnPrev.removeAttribute('disabled')
      btnNext.innerHTML = '下一步 &#129058'
    } else if (model.step === 3) {
      btnNext.innerHTML = '確認下單'
    }
  },

  // 購物籃單項物品總金額
  setItemTotalPrice: function (event, currentNum, updateNum) {
    // 取得目前該項 item 的總金額
    const currentTotalPrice = Number(event.target.parentElement.parentElement.children[2].textContent)
    // 計算該項 item 的 單價 以及 更新數量後的總金額
    const itemPrice = currentTotalPrice / currentNum
    const updateTotalPrice = itemPrice * updateNum

    // 渲染該項 item 更新數量後的總金額，以及所有物品總金額
    event.target.parentElement.parentElement.children[2].textContent = updateTotalPrice
    view.setItemsTotalPrice()
  },

  // 購物籃所有物品總金額
  setItemsTotalPrice: function () {
    // 取得各項 item 各別的總金額
    const itemTotalPrices = document.querySelectorAll('.item-total-price')
    let ItemsTotalPrice = 0

    // 將各項 item 各別的總金額，總加成物品總金額 ItemsTotalPrice
    itemTotalPrices.forEach(itemTotalPrice => {
      ItemsTotalPrice += Number(itemTotalPrice.textContent)
    })
    model.ItemsTotalPrice = ItemsTotalPrice

    // 回傳物品總金額 ItemsTotalPrice，重新計算所有物品總金額 + 運費 之總金額，並渲染畫面
    view.setItemsAndShipTotalPrice(model.ItemsTotalPrice)
  },

  // 購物籃所有物品總金額 + 運費 之總金額
  setItemsAndShipTotalPrice: function (ItemsTotalPrice) {
    const itemsAndShipTotalPrice = document.querySelector('.total-price-wrapper').children[1]
    const shipPrice = document.querySelector('.ship-price-wrapper').children[1].textContent
    if (shipPrice === '免費') {
      itemsAndShipTotalPrice.textContent = ItemsTotalPrice
    } else {
      itemsAndShipTotalPrice.textContent = ItemsTotalPrice + Number(shipPrice)
    }
  }
}

// 顯示畫面初始，購物籃所有物品總金額
view.setItemsTotalPrice()

// 手機版，漢堡排切換顯示 nav
hamburgerCheckbox.addEventListener('click', function () {
  controller.switchHamburgerCheckbox()
})

// dark mode
darkmodeIcon.addEventListener('change', function (event) {
  controller.switchDarkMode(event)
})

// 表單下一步操作
btnNext.addEventListener('click', function (event) {
  controller.buttonNextStep(event)
})

// 表單上一步操作
btnPrev.addEventListener('click', function (event) {
  controller.buttonPrevStep(event)
})

// 增減 item 數量 (增加)
btnPlus.forEach(btn => btn.addEventListener('click', function (event) {
  controller.buttonItemNum(event)
}))

// 增減 item 數量 (減少)
btnMinus.forEach(btn => btn.addEventListener('click', function (event) {
  controller.buttonItemNum(event)
}))

// 選擇商品運送方式
shipRadio.forEach(radio => radio.addEventListener('click', function (event) {
  controller.shipRadio(event)
}))
