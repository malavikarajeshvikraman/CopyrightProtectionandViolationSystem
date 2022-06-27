pragma solidity>=0.4.20;

contract copyrightcontract
{   
    struct copyright
        {   uint copyright_id;
            string  imageHash;
            int  auth_id;
            bytes32  phashpart1;
            bytes32  phashpart2;
        }
    uint numCopyrights;
     mapping(uint => copyright) public licenses;
    function newCopyright(string memory _imageHash,bytes32  _phashpart1, bytes32  _phashpart2,int _authid) public 
    {   
         numCopyrights++;
          copyright  storage c = licenses[numCopyrights];
          c.imageHash =  _imageHash;
          c.phashpart1 = _phashpart1;
          c.phashpart2 = _phashpart2;
          c.auth_id =_authid;

    }
   
}