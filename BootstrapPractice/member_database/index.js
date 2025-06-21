const studentName = document.querySelector('.registerForm #name')
const studentDob = document.querySelector('.registerForm #dob')
const studentGender = document.querySelector('.registerForm #gender')
const studentLocation = document.querySelector('.registerForm #location')
//select all the elements that has a name attribute to check if they are empty later on
const registerInfo = document.querySelectorAll('.registerForm [name]')
// console.log(registerInfo)

const registerForm = document.querySelector('.registerForm')
const tbody = document.querySelector('table tbody')
//Get data from local storage, if no local data, then it is an empty array
const sample = {
  id: 1,
  name: 'Hui',
  dob: '2009-09-19',
  gender: 'Female',
  location: 'Boston',
  date: '4/9/2099, 9:09:09 PM'
}
let arr = JSON.parse(localStorage.getItem('member')) || []
// console.log(arr)
if (arr.length === 0) arr.unshift(sample)
localStorage.setItem('member', JSON.stringify(arr))
render()

function render() {
  //Each time a submit action is triggered, the old existing data will be printed along with the new data, 
  //causing repetition. Need to clear the table before printing
  tbody.innerHTML = ''

  //create new rows, print table data(everything in data, every objects in arr)
  // for (let i = 0; i < arr.length; i++) {
  //   const tr = document.createElement('tr')
  //   tr.innerHTML = `
  //     <td>${arr[i].id}</td>
  //     <td>${arr[i].name}</td>
  //     <td>${arr[i].dob}</td>
  //     <td>${arr[i].gender}</td>
  //     <td>${arr[i].location}</td>
  //     <td>${arr[i].date}</td>
  //     <td><a href="#" data-id=${i}>Delete</a></td> 
  //   `
  // }

  //rewrite render function using map() and join():
  // data-id: the nth row
  tbody.innerHTML = arr.map((ele, index) => {
    return `
          <tr>
            <td>${ele.id}</td>
            <td>${ele.name}</td>
            <td>${ele.dob}</td>
            <td>${ele.gender}</td>
            <td>${ele.location}</td>
            <td>${ele.date}</td>
            <td class="btns" data-id=${index}>
              <a href="#" class="edit">Edit</a>
              <a href="#" class="delete">Delete</a>
            </td> 
          </tr>  
        `
  }).join('')
}

const addModal = new bootstrap.Modal(document.getElementById('addModal'))
//when submit action is detected, create an object with these values and add to the array
registerForm.addEventListener('submit', (e) => {
  e.preventDefault()
  // important! or everything will be refreshed and not saved

  //collect data and store into an object
  const data = {
    id: arr.length + 1, //take note on this
    name: studentName.value,
    dob: studentDob.value,
    gender: studentGender.value,
    location: studentLocation.value,
    date: new Date().toLocaleString()
  }

  // making sure the input is not empty
  for (let i = 0; i < registerInfo.length; i++) {
    // console.log(registerInfo[i].value)
    if (registerInfo[i].value === '') {
      return alert('Error: Please fill out all the blanks')
    }
  }

  arr.push(data)
  localStorage.setItem('member', JSON.stringify(arr))
  registerForm.reset()
  // we use "this" in this case instead of calling the object "form"
  render()
  // close the modal
  addModal.hide()
})

const editModal = new bootstrap.Modal(document.getElementById('editModal'))
const editForm = document.querySelector('.editForm')
// editModal submit action
editForm.addEventListener('submit', (e) => {
  e.preventDefault()

  const data = serialize(editForm, {hash: true, empty: true})
  // console.log(data)
  
  //find the obj that needs to be modified and then render
  const target = arr[editIndex]
  // console.log(target)
  // change the localstorage and render again
  Object.keys(data).forEach(key => {
    target[key] = data[key]
  })
  // console.log(target)
  localStorage.setItem('member', JSON.stringify(arr))
  render()

  editModal.hide()
})

let editIndex = null
//delete or edit a member from the list 
tbody.addEventListener('click', function (e) {
  if (e.target.classList.contains('delete')) {
    arr.splice(e.target.parentNode.dataset.id, 1)
    localStorage.setItem('member', JSON.stringify(arr))
    render()
  }
  if (e.target.classList.contains('edit')) {
    editModal.show()
    
    // locate the target object in localstorage array according to the assigned id
    const index = e.target.parentNode.dataset.id
    editIndex = index
    const currentMember = JSON.parse(localStorage.getItem('member'))[index]
    // get all the property names of the table except the first one(id)
    //vv Output: ['name', 'dob', 'gender', 'location']
    const infoList = Object.keys(currentMember).splice(1, 4)
    //render: display the row of data in editForm vv
    infoList.forEach(key => {
      // console.log(document.querySelector(`.editForm #${key}`).value)
      // console.log(currentMember[key])
      document.querySelector(`.editForm #${key}`).value = currentMember[key]
    })
  }
})