import { useState, useEffect } from "react";
import axios from "axios";

export default function Shopper(){
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([{id:0, title:", image:", price:0, category:", description:", rating: {rate:0, count:0 }}]);
    const [cartItems] = useState([]);
    const [cartCount, setCartCount] = useState(0);
    const [showToggle, setShowToggle] = useState({'display':'none'});
    const [totalPrice, setTotalPrice] = useState(0);

    function GetCategories(){
        axios.get("https://fakestoreapi.com/products/categories")
        .then(response=>{
            response.data.unshift("all");
            setCategories(response.data);
        });
    }

    function GetProducts(url){
        axios.get(url)
        .then(response=>{
            setProducts(response.data);
        })
    }
    useEffect(()=>{
        GetCategories();
        GetProducts("http://fakestoreapi.com/products");
        GetCartCount();
    },[]);

    function CategoryChange(e){
        if(e.target.value==="all"){
            GetProducts("http://fakestoreapi.com/products");
        }else {
            GetProducts(`http://fakestoreapi.com/products/category/${e.target.value}`);
        }

    }
    function setAllProducts(){
        GetProducts("https://fakestoreapi.com/products");
    }
    function filterMensWear(){
        GetProducts("https://fakestoreapi.com/products/category/men\'s clothing");
    }
    function filterWomensWear(){
        GetProducts("https://fakestoreapi.com/products/category/women\'s clothing");
    }
    function filterJewellary(){
        GetProducts("https://fakestoreapi.com/products/category/jewelery");
    }
    function filterElectronics(){
        GetProducts("https://fakestoreapi.com/products/category/electronics");
    }
    function AddToCartClick(e){

        axios.get(`http://fakestoreapi.com/products/${e.target.value}`)
        .then(response=>{
            cartItems.push(response.data);
            alert(`${response.data.title} \n ADDED TO CART`);
            calculateTotalPrice();
            GetCartCount();
            })   
    }
    const calculateTotalPrice = ()=>{        
        const total = cartItems.reduce((initial, total)=>{
            return initial + total.price;
        },0)
        setTotalPrice(total)
    }
    function removeClick(e){
        cartItems.splice(e.currentTarget.id,1);
        GetCartCount();
        calculateTotalPrice();
    }
    function GetCartCount(){
        setCartCount(cartItems.length)
    }
   
    function showCart(){
        setShowToggle({'display':'block', 'transition':"1s"});
    }
    function hideCart(){
        setShowToggle({'display':'none'});
    }

    function searchClick(){
        const productName = document.getElementById("searchBox").value.toLowerCase();
        const searchedProduct = products.filter(product => product.title.toLowerCase().includes(productName));
        if(searchedProduct.length === 0){
            alert(`${productName} Not Found`);
        } else {
            setProducts(searchedProduct);  
        } 
    }
    const placeholderColor = '#DAA520';
    const bold = 'bold';
    return(
      
        <div className="container-fluid bg-body-secondary">
          
            <header className='bg-dark d-flex justify-content-between p-3 mt-1 rounded rounded-2'>
                <div className="text-white fw-bold h1" onClick={setAllProducts}>
                    Shopper.
                </div>
                <div>
                    <span className="me-4  text-white fw-bold btn btn-link link-underline-dark" onClick={filterMensWear}>MEN'S WEAR</span>
                    <span className="me-4 text-white fw-bold btn btn-link link-underline-dark" onClick={filterWomensWear}>WOMEN'S WEAR</span>
                    <span className="me-4 text-white fw-bold btn btn-link link-underline-dark" onClick={filterJewellary}>JEWELLARY'S</span>
                    <span className="me-4 text-white fw-bold btn btn-link link-underline-dark" onClick={filterElectronics}>ELECTRONIC'S</span>
                </div>
                <div>
                    <button onMouseOver={showCart} onMouseOut={hideCart} className='btn btn-light position-relative fw-bold'>
                        Your Cart <span className="bi bi-cart4"></span>
                        <span className="badge position-absolute top-0 end-0  bg-danger">{cartCount}</span>
                    </button>
                </div>
            </header>
            <section className="row mt-2 border border-1 container-fluid p-2 bg-body-secondary">
                <nav className="col-2">
               <div>
               <lable className="form-lable fw-bold">Select Category</lable>
               <div>
                <select id="" onChange={CategoryChange} className="form-select mt-2">
                    {
                        categories.map(category=>
                            <option value={category} key={category}>{category.toUpperCase()}</option>
                            )
                    }
                </select>
               </div>
                    <label className="form-lable fw-bold">Search For Product</label>
                    <div className="mt-2 input-group">
                            <input type="text" id="searchBox" className="form-control custom-placeholder" placeholder="Search" /><button className="btn btn-dark bi bi-search" onClick={searchClick}></button>
                    </div>
               </div>
                </nav>
                <main className="col-8 d-flex flex-wrap overflow-scroll" style={{height:'550px'}}>
                {
                    products.map(product=>
                        <div className="card p-2 m-1" key={product} style={{width:'220px'}}>
                            <img src={product.image} className="card-img-top" alt="" height="140" />
                            <div className="card-header overflow-auto" style={{height:"100px"}}>
                                <h6>{product.title}</h6>
                            </div>
                            <div className="card-body">
                            <dl>
                                <dt>Price</dt>
                                <dd>{product.price}</dd>
                                <dt>Rating</dt>
                                <dd>
                                    {product.rating.rate}
                                    <span className="bi bi-star-fill text-success"></span>
                                    [{product.rating.count}]
                                </dd>
                            </dl>
                            </div>
                            <div className="card-footer">
                                <button className="btn btn-danger w-100 fw-bold" value={product.id} onClick={AddToCartClick}>ADD TO CART <span className="bi bi-cart-plus text-dark"></span></button>
                            </div>
                        </div> 
                        )
                }
                </main>
                <aside className="col-2">
                    <div style={showToggle}>
                        <label className="form-lable fw-bold text-info">CART ITEMS</label>
                        <table className="table table-hover p-2">
                            <thead>
                                <tr className="text-warning">
                                    <th className="text-secondary">PREVIEW</th>
                                    <th className="text-secondary">PRICE</th>
                                    <th className="text-secondary">ACTION</th>
                                </tr>
                            </thead>
                                <tbody>
                                    {
                                    cartItems.map((item, i)=>
                                    <tr key={item.id}>
                                        <td><img src={item.image} alt="" width="60" height="60"/></td>
                                        <td>{item.price}</td>
                                        <td><button onClick={removeClick} className="btn"><span className="bi bi-trash3 text-danger"></span></button></td>
                                    </tr>
                                    )
                                    }   
                                </tbody>
                                <tfoot>
                                    <tr className="row">
                                        <td className="col-10 fw-bold text-danger">TOTAL=</td>
                                        <td className="col-2">${totalPrice}</td>
                                    </tr>
                                </tfoot>  
                        </table>
                    </div>
                </aside>
            </section>
            <style>
              {`
                .custom-placeholder::placeholder {
                  color: ${placeholderColor};
                  font-weight: ${bold}
                }
              `}
            </style>
        </div>
    )
}
