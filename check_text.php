<?php

	$text = $_POST['text'];

	$file = fopen("words.txt", "r") or exit("Unable to open file!");
    
    $i = 0;

    while(!feof($file))
    {
      $arr[$i] = fgets($file);
      
      $i++;
    }
    
    fclose($file);

    $flag = 0;

    for($j = 0; $j < $i && $flag == 0; $j++)
    {
    	$pos = strpos($text, $arr[$j]);

    	if(!$pos)
    	{
    		$flag = 1;
    	}
    }

    echo $flag;
    
?>