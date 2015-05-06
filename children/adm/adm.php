<?
if(!empty($_GET)) extract($_GET);
if(!empty($_POST)) extract($_POST);

// Обращения к БД
// decrease_n: mysql_query("select * from messages where message_id=$it");
// decrease_n: mysql_query("select * from messages where message_id=$sb");
// decrease_n: mysql_query("update messages set number_of_answers='$p' where message_id='$sb'");

// delete_item: $res=mysql_query("select author_id from messages where message_id=$it");
// delete_item: $res2=mysql_query("select message_id from messages where author_id=$p");
// delete_item: mysql_query("delete from authors where author_id=$p");
// delete_item: $res1=mysql_query("select message_id from messages where sub_item_of=$it");
// delete_item: mysql_query("delete from messages where message_id=$it");

if ($subitemof==0) {$str="forum.php";}
else {$str="item.php?item=$subitemof";}
header("location: $str");

$mysql_login='telemed';$mysql_host='localhost';$mysql_pass='Sync**Pana';$mysql_db='telemed';

if(!@mysql_connect($mysql_host,$mysql_login,$mysql_pass))    
{  echo "<br>&nbsp;<br>&nbsp;<br>&nbsp;<br>&nbsp;<br>&nbsp;<br>&nbsp;<br>&nbsp;<br>&nbsp;";
   echo "Невозможно соединиться с базой. Форум временно недоступен.<br>";    
   echo "<br>&nbsp;<br>&nbsp;<br>&nbsp;<br>&nbsp;<br>&nbsp;<br>&nbsp;<br>&nbsp;<br>&nbsp;";
   exit;    
}

mysql_select_db($mysql_db);

function decrease_n($it)
{
//---------------------------1-------------------------
// Найти номер сообщения, которому подчинено текущее
 
/// Decrease number_of_messages anywhere in message-tree
$res=mysql_query("select * from messages where message_id=$it");
$sb=mysql_result($res,0,"sub_item_of");
//$sb=mysql_query("select sub_item_of from messages where message_id=$it");
while ( $sb!=0)
{
 $res=mysql_query("select number_of_answers,sub_item_of from messages where message_id=$sb");
 $p=mysql_result($res,0,"number_of_answers");
 $p-=1;
 mysql_query("update messages set number_of_answers='$p' where message_id='$sb'");
 $sb=mysql_result($res,0,"sub_item_of"); 
}
}

function delete_item ($it)
// Deletes item $it and its subitems from db
// Also deletes authors of all this items
{
  // decrease number_of_answers anywhere in message-tree
  decrease_n($it);
  
//--------------------------4-------------------------
// Удаление автора

  // delete author of item $it
  $res=mysql_query("select author_id from messages where message_id=$it");// or die ("Can not Select");
  $kol=mysql_num_rows($res);
  if ($kol==0) { echo "No authors!";}
  else
  {
   $p=mysql_result($res,0,"author_id");
   // is author with this id send other messages?

//------------------------5----------------------------
// Проверка, есть ли у автора еще сообщения

   $res2=mysql_query("select message_id from messages where author_id=$p");
   $kol2=mysql_num_rows($res2);
   // if there is 1 message(this one) then delete author
   if ($kol2==1) 
//------------------------6----------------------------
// Удалить автора

    {mysql_query("delete from authors where author_id=$p"); }
     
  }
  
//------------------------7------------------------------
// Найти номера подтем

  // find in db items with sub_item_of == $it
  $res1=mysql_query("select message_id from messages where sub_item_of=$it");// or die ("Can not delete");
  // For all such items do delete($..)
  $kol=mysql_num_rows($res1);
  if ($kol==0) { echo "No subitems. All of them was deleted";}
  else
  {
  for ($i=0; $i<$kol; $i++)
   {
     $j=mysql_result($res1,$i,"message_id");
     delete_item ($j);
   }//end for 
  } // else

//---------------------8-----------------------------
// Удалить сообщение

  // delete item $it from db
  mysql_query("delete from messages where message_id=$it");// or die ("Can not delete");

}// end function

////////////////////////////

// $$nameid = number of message for delete in mysql db
// $$name = number of checked box. 
//          If $$name isn't set, the appropriate checkbox wasn't been checked.
// $kol = number of messages on the level, where items was checked

for ($i=0; $i<$kol; $i++)
 {
  $name = "n".$i;
  $nameid = "id".$i;
  if (isset($$name)&&($$name=="on"))
  {
   echo "$name is set. ";  
   echo "- number in db is  ".$$nameid."<br>";
   // prepare for deletion
   
   // delete item and all its subitems
   delete_item ($$nameid);
  }
 }

?>