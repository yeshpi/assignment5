const deleteProduct=(btn)=>{
    console.log('clik' ,btn);
    const productId=btn.parentNode.querySelector('[name=productId]').value
    const csrfToken=btn.parentNode.querySelector('[name=_csrf]').value
    const productElement=btn.closest('article')
    console.log(productElement);
    
    fetch('/admin/delete-p/' + productId, {
        method: 'DELETE',
        headers: {
            'csrf-token': csrfToken
        }
    })
        .then(result => {
            console.log(result.ok);
    
            if (!result.ok) {
                throw new Error('Network response was not ok');
            } else {

                productElement.parentNode.removeChild(productElement);
               return result.json()
            }
        }).then(result=>{console.log(result)})
        .catch(err => console.error('Fetch Error:', err));
    
}