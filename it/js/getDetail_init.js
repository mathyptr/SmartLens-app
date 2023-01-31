jQuery(document).ready(function(){
    console.log("READY");
    jQuery('#camera').getDetailFromWebcam(
        {serverURL:"../server/actions.php" }
    );
});