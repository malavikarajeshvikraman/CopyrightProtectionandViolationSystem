pragma solidity>=0.4.20;

contract cownershipcontract
{   
    struct cownership
        {   uint cownership_id;
            string  imageHash;
            int  owner_id;
            int  user_id;
        }
    uint numCownerships;
     mapping(uint => cownership) public cownershiplicenses;
    function newCownership(string memory _imageHash,int _owner_id,int _user_id) public 
    {   
         numCownerships++;
          cownership storage c = cownershiplicenses[numCownerships];
        
          c.imageHash=_imageHash;
        c.owner_id =  _owner_id;
          c.user_id = _user_id;
     
    }
   
}