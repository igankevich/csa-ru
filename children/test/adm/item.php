<?
include("head.shtml");
echo "<table width=650><tr><td class=forum_total>";

$mysql_login='telemed';     
$mysql_host='localhost';       
$mysql_pass='4ddykTNZ9B';       
$mysql_db='telemed';

if(!@mysql_connect($mysql_host,$mysql_login,$mysql_pass))    
{  echo "Невозможно соединиться с базой. Форум временно недоступен.<br>";    
   echo "</td></tr></table>";
   include("footer.shtml");
   exit;    
}
//mysql_connect($mysql_host,$mysql_login,$mysql_pass);
mysql_select_db($mysql_db);

//===================================================
function show_item($it)
{
$res=mysql_query("select * from messages where sub_item_of=$it") or die ("Can not Select");
$kol=mysql_num_rows($res);
if ($kol==0) { echo "Empty";}
else
{
echo "<FORM name=AdmForm method=GET action=\"adm.php\">";
echo "<input type=submit value=Delete! style=\"COLOR: blue; BACKGROUND-COLOR: #eeeeee; border-color : #eeeeee;\"><p>";
for ($i=0; $i<$kol; $i++)
 {
  echo "<tr><td class=forum_serv>";
  $j=mysql_result($res,$i,"message_id");
  $s=mysql_result($res,$i,"sub_item_of");
  ///
  echo "<input type=checkbox name=n$i>";
  echo "<input type=hidden name=id$i value=$j>";
  echo "<input type=hidden name=subitemof value=$s>";
  ///
  /// link or plain text?
  $pp=mysql_result($res,$i,"message_id");  
  $res1=mysql_query("select * from messages where sub_item_of=$pp") or die ("Can not Select");
  $kol1=mysql_num_rows($res1);
  
  $p=mysql_result($res,$i,"theme");
  if (strlen($p)>20) { $p=substr($p,0,20).'...';}
  $j=mysql_result($res,$i,"message_id");
  //if ($kol1!=0) 
  { echo "<a class=forum_big href=\"item.php?item=$j\">$p</a>"; }
  //else
  //{ echo "<FONT class=forum_big>$p</FONT>";}
  echo "</td><td class=forum_serv>";
  ///
  

  $p=mysql_result($res,$i,"date");
  echo "$p";
  echo "</td><td align=center class=forum_serv>";
  $p=mysql_result($res,$i,"number_of_answers");
  echo "$p";
  echo "</td><td class=forum_serv>";
  $p=mysql_result($res,$i,"author_id");  
  $res1=mysql_query("select * from authors where author_id=$p") or die ("Can not Select in authors");        
  $kol1=mysql_num_rows($res1);
  if ($kol==0) { echo "Empty author";}
  else
  {
   $email=@mysql_result($res1,0,"email");// or die ("Empty");
   $name=@mysql_result($res1,0,"name");// or die ("Empty");
   if (strlen($name)>10) { $name=substr($name,0,10).'...'; }
   if (strlen($name)==0){echo "<FONT class=forum_serv>Empty</FONT>";}
   else {   echo "<a class=forum_big href=\"mailto:$email\">$name</a>";}
   echo "</td></tr>";  
  }
  echo "<tr><td colspan=4 class=forum_main>";
  $p=mysql_result($res,$i,"text");
// prepare text
 $p = ltrim($p);
 $p = nl2br($p);
 if (strlen($p)>60) { $p=substr($p,0,60)." <a class=forum_small href=\"item.php?item=$pp\">More...</a>"; }

//
  echo $p;
  $p=mysql_result($res,$i,"message_id");

  echo "<br><a class=forum_small href=\"add_message.php?sub=$p&quo=0\">Answer</a>";
  echo "&nbsp;&nbsp;<a class=forum_small href=\"add_message.php?sub=$p&quo=1\">Answer with quotation</a>";
  echo "</td></tr>";
 }// end for
echo "<input type=hidden name=kol value=$kol>";
echo "</FORM>";

} // end else
}// end of show_item
//===================================================

$res=mysql_query("select * from messages where message_id=$item") or die ("Can not Select");
$kol=mysql_num_rows($res);
if ($kol==0) { echo "Empty";}
else
{
  $strlength = 50;
  $p=mysql_result($res,0,"theme");
  $pp=mysql_result($res,0,"text");
  if (strlen($p)>$strlength) { $p=substr($p,0,$strlength).'...';}
  echo "<center><FONT class=forum_headers>$p</FONT></center><br>";
  echo "<center><table width=600 border=1><tr><td>";
  $pp = ltrim($pp);
  // cut long strings
//  $sep = chr(10);
//  $pieces = explode($sep,$pp);
//  $pp = "";
//  for ($i=0;$i<count($pieces);$i++)
//  {
//   if (strlen($pieces[$i])>$strlength)
//   {$pp .= chunk_split($pieces[$i], $strlength , $sep );}
//   else {$pp .= $pieces[$i]; $pp.= chr(10);}
//  }
  // 
//  $pp = nl2br($pp);
  echo "$pp";
  echo "<br><a class=forum_small href=\"add_message.php?sub=$item&quo=0\">Answer</a>";
  echo "&nbsp;&nbsp;<a class=forum_small href=\"add_message.php?sub=$item&quo=1\">Answer with quotation</a>";
  echo "</td></tr></table>";

// draw tree
echo "<center><table width=600 border=0><tr><td>";

  $resstr="";
  $p=mysql_result($res,0,"theme");
  $e=mysql_result($res,0,"sub_item_of");
  if (strlen($p)>20) { $p=substr($p,0,20).'...';}
  $resstr .= "$p";

  while ($e!=0)
  {   
   
   $res1=mysql_query("select * from messages where message_id=$e");// or die ("Can not Select");
   $p=mysql_result($res1,0,"theme");
   $j=mysql_result($res1,0,"message_id");
   $e=mysql_result($res1,0,"sub_item_of");

   if (strlen($p)>20) { $p=substr($p,0,20).'...';}
   $resstr .= "<< <a class=forum_big href=\"item.php?item=$j\">$p</a>";
   
  }
  $resstr.="<< <a class=forum_big href=\"forum.php\">Main forum page</a>";
  echo "$resstr";

echo "</td></tr></table>";
echo "<br><br>";
//

}
//

//===================================================
$res=mysql_query("select * from messages where sub_item_of=$item") or die ("Can not Select");
$kol=mysql_num_rows($res);
if ($kol==0) { echo "<br><center>No answers</center>";}
else
{
echo "<center><table width=600 cellspacing=\"1\" cellpadding=\"0\" bordercolor=black border=1><tr><td class=forum_headers>Theme</td><td class=forum_headers>Date</td><td class=forum_headers>Number of Answers</td><td class=forum_headers>Author</td></tr>";
show_item($item);
echo "</table>";
}
//===================================================
$res=mysql_query("select sub_item_of from messages where message_id=$item") or die ("Can not Select");
$kol=mysql_num_rows($res);
if ($kol!=0) 
{
$p=mysql_result($res,0,"sub_item_of");
if ($p==0) {$str="forum.php";}
else {$str="item.php?item=$p";}

echo "<br><br><center><a class=forum_big href=$str>One level Up</a>";
echo "<br><a class=forum_big href=\"forum.php\">Main forum page</a></center>";

}

echo "</td></tr></table>";
echo "<br><center><FONT class=forum_copyright>Copyright ".chr(169)." </FONT><a class=forum_small href=\"mailto:alexevl@fn.csa.ru\">Evlampiev Alexey</a>"."</center>";
include("foot.shtml");

?>