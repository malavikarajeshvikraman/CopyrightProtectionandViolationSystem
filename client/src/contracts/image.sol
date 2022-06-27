pragma solidity>=0.4.20;

contract image 
{
    string imageHash;

 //write function
    function set(string memory _imageHash) public 
    {
        imageHash= _imageHash;
    }
 // read function
    
    function get () public view returns (string memory)
    {
        return imageHash;
    }

}