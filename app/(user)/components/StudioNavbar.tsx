import Link from "next/link";
import '../../../styles/back.css'

function StudioNavbar(props: any) {
  return (
    <div className="flex navBar flex-col text-white bg-[#101112] ">
      <Link className=" back p-4" href="/">
      ← Go To Website 
      </Link>
 <div>     {props.renderDefault(props)}</div>

    </div>

  );
}
export default StudioNavbar;
