<?php
if(!empty($_GET)) extract($_GET);
if(!empty($_POST)) extract($_POST);

include("header1.shtml");

?>

<FONT class=f>
<br>
<table width=600>
<tr>
<td>&nbsp;</td>
<td> 

<p>
<FONT class=f>

<FORM name=MyForm action=sent.php method=post onsubmit="return sendform();">

    ���� ���: <input type="text" name="username" ><p>
    ��� ����� e-mail: <input type="text" name="email" ><p>
    ���� ������: <input type="text" name="item" size=40 ><p>
    ����� ������: <br><textarea name="text" rows=10 cols=40 wrap=soft></textarea><p>
    <input type="submit" value = "�������" style="color: blue">

</FORM>
<FORM name=MyForm1 action="return.php" method="post">
<input type="submit" value = "������" style="color: red">
</FORM>
</td></tr></table>
</FONT>

<?php

include("footer.shtml");

?>
