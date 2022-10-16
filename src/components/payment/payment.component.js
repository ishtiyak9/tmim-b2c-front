import axios from "axios";
import { useEffect, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";
import { UserContext } from "../../pages/dashboard/dashboard";
import Swal from "sweetalert2";

const PaymentComponent = () => {
  const params = useParams();
  const history = useHistory();
  const userContextData = useContext(UserContext);
  const fetchPaymentVerify = () => {
    axios({
      method: "get",
      url: `${process.env.REACT_APP_PAYMENT_VERIFICATION_URL + params.id}`,
    })
      .then((res) => {
        if (res.data.data) {
          localStorage.setItem(
            "payment_status",
            String(res.data.data.payment_status)
          );
          localStorage.setItem(
            "subscription_plan",
            res.data.data.subscription_plan_info.subscription_plan
          );
          if (
            res.data.data.subscription_plan_info.subscription_plan === "premium"
          ) {
            localStorage.setItem("Subscription_status", 1);
            
            // localStorage.setItem("Subscription_status", res.data.data.subscription_plan_info.Subscription_status);
          }
          Swal.fire({
            title: "Subscription completed successfully !!!",
            confirmButtonText: `Continue`,
          }).then((result) => {
            if (result.isConfirmed) {
              userContextData.onChangeSetProviderValue();
              history.push("/dashboard");
            }
          });
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    fetchPaymentVerify();
  }, []);

  return (
    <div className="c-app">
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <h1> Congratulations! Your payment has been completed successfully.</h1>
    </div>
  );
};

export default PaymentComponent;
