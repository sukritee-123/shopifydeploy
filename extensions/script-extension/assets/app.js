

 
/**
 * The function `addScript` dynamically creates a script element and appends it to the head of the
 * document, loading a script from a specific URL and logging success or error messages.
 * @param data - The `data` parameter is an object that contains the following properties:
 */
function addScript(data){
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://scripts.openinapp.com/shopify:${data.data.shopify_user_id}:${data.data.shop_id}.js`;
   
    script.onload = () => {
        console.log('Script loaded successfuly');
      };
      
      script.onerror = () => {
        console.log('Error occurred while loading script');
      };
      
    document.head.appendChild(script);
}

/**
 * The function `getUserDataById` makes an asynchronous request to a Shopify API endpoint to retrieve
 * user data and then calls the `addScript` function with the retrieved data.
 * @returns The function `getUserDataById` returns either the status code of the response if it is not
 * 200, or the data received from the API call if the response status is 200.
 */
const getUserDataById = async () => {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },

  };
  try {
    const res = await fetch(`https://apishopify.openinapp.com/api/v1/user/get-shopify-user?id=${Shopify?.shop}`, requestOptions)
   
    if (res.status === 200) {
      
      const data = await res.json();
   
      addScript(data)
     
 
    } else {
      return res.status;
    }

  } catch (err) {
    return err;
  }
}
   

getUserDataById();