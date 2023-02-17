namespace DID2023.Helper
{
    public class PersonelViewModel
    {
        public string bina { get; set; }
        public List<Personal> perList { get; set; }
    
        public PersonelViewModel()
        {
            perList = new List<Personal>();
        }
    }

}
