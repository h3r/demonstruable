<?php
$name = $_REQUEST['name'] ;
$email = $_REQUEST['email'] ;
$Message = $_REQUEST['Message'] ;  
$to="jhini.mehta@gmail.com";
/*if(isset($_POST['submit']) && $_POST['submit']=="Submit")
{*/
$subject3=": Contact Information";  

$headers = "Name: $name\r\n";
$headers .= "Email: $email\r\n";
$headers .= "Message: $Message\r\n";
if (mail($to, $subject3, $headers)){
?>
<div style="
    text-align: center;  font-size: 24px;  margin-top: 5%;
"> Message Successfully Sent </div>
<?php
}
?>