console.log('jjjj')
var stripe = Stripe('pk_test_51OQUoKIZZkpC98UB2AqE5F7PxcyN22efgip94daOD2Dn6eVBVo6KGlO2AESJIoTCFzH43eDnTYvV4jGSomnG9nYK00tyUpE90j');
var orderBtn=document.getElementById('order-btn');
var sessionId = orderBtn.getAttribute('data-session-id');
orderBtn.addEventListener('click',function(){
    stripe.redirectToCheckout({
        sessionId:sessionId    

    })

})