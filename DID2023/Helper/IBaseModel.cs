using LiteDB;

namespace DID2023.Helper
{
    public interface IBaseModel
    {
        public string Add(string obj);
        public List<PersonelViewModel> GetPersonLocation(string obj);
        public List<Personal> GetPersonName(string obj);
        public bool isPerson(ILiteCollection<Personal> table,string tel);
    }
}
