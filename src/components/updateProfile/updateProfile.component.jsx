import { useState, useContext, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import {
  Form,
  Input,
  Select,
  DatePicker,
  Upload,
  Modal,
  Tooltip,
  Button,
  InputNumber,
} from "antd";
import { LoadingOutlined, PlusOutlined, UserOutlined } from "@ant-design/icons";
import Dashboard, { UserContext } from "../../pages/dashboard/dashboard";
import moment from "moment";
import Swal from "sweetalert2";

import HomeIcon from "../../assets/icons/home.svg";
import LocationIcon from "../../assets/icons/location.svg";
import StateCodeIcon from "../../assets/icons/zip.svg";
import PriceIcon from "../../assets/icons/price.svg";
import DiscountIcon from "../../assets/icons/discount.svg";
import UpdateProfile from "../../assets/icons/updateprofile.svg";
import CompanyPhoto from "../../assets/images/company-pic.svg";
import UploadIcon from "../../assets/icons/Upload.svg";

import "./css/updateProfile.css";
import "antd/dist/antd.css";
import ButtonComponent from "../../shared/component/button/button.component";
import ValidateMessageComponent from "../../shared/component/validation/validationerror.component";
import ContainerDiv from "../../container/container-div";
import { Editor } from "@tinymce/tinymce-react";
import TitleComponent from "../../shared/component/title.component";
import "tinymce/tinymce";
import "tinymce/icons/default";
import "tinymce/themes/silver";
import "tinymce/plugins/paste";
import "tinymce/plugins/link";
import "tinymce/plugins/image";
import "tinymce/plugins/table";
import "tinymce/skins/ui/oxide/skin.min.css";
import "tinymce/skins/ui/oxide/content.min.css";
import "tinymce/skins/content/default/content.min.css";

import {
  deleteData,
  getData,
  getDataWithoutToken,
} from "../../shared/http-request-handler";
import SpinnerComponent from "../../shared/component/spinner/spinner.component";
import LoadingComponent from "../../shared/component/loading/loading";

const UpdateProfileComponent = (props) => {
  const { t } = useTranslation();
  const { i18n } = useTranslation();
  const userContextData = useContext(UserContext);
  const [countryList, setCountryList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [filteredCityList, setFilteredCityList] = useState([]);

  const [changeAlignment, setChangeAlignment] = useState(
    userContextData.selectedLanguage === "en" ? "left" : "right"
  );
  const [form] = Form.useForm();
  const editorRef = useRef(null);
  const editorRefArabic = useRef(null);
  const [fileCount, setFileCount] = useState(0);
  const [fetchedProfileData, setFetchedProfileData] = useState(false); // for loading
  const [editorValue, setEditorValue] = useState("");
  const [editorValueArabic, setEditorValueArabic] = useState("");
  const { TextArea } = Input;
  const [complete, setComplete] = useState(false);
  const [manageDetailsServiceLength,setManageDetailsServiceLength]= useState();
  const [manageDetailsServiceArabicLength,setManageDetailsServiceArabicLength]= useState();

  // console.log('----->>.',userContextData);
  /**
   * todo
   * refactor this text rendering methods
   */

  let serviceDetailsText = <p>{t("service-details-text-common")}</p>;
  let uploadImagesVideosText = (
    <p>{t("upload-images-videos-text-free-user")}</p>
  );
  let discountText = (
    <p>
      {t("discount-field-text-free-user")}
      <span className="text-danger">
        {t("discount-field-text-free-user-type")}
      </span>
    </p>
  );
  if (userContextData.plan === "premium") {
    uploadImagesVideosText = (
      <p>{t("upload-images-videos-text-premium-user")}</p>
    );
    discountText = (
      <p>
        {t("discount-field-text-premium-user")}
        <span className="text-danger">
          {t("discount-field-text-free-user-type")}
        </span>
      </p>
    );
  } else {
    uploadImagesVideosText = <p>{t("upload-images-videos-text-free-user")}</p>;
    discountText = (
      <p>
        {t("discount-field-text-free-user")}
        <span className="text-danger">
          {t("discount-field-text-free-user-type")}
        </span>
      </p>
    );
  }

  /**
   * Profile Image upload and preview image
   */
  const [imageUrl, setImageUrl] = useState();
  const [imageObj, setImageObj] = useState();
  const [loading, setLoading] = useState();
  const [touched, setTouched] = useState(false);
  const uploadButton = (
    <div>
      {/* {loading ? <LoadingOutlined /> : <PlusOutlined />} */}
      {/* <div style={{ marginTop: 8 }}>Upload</div> */}
      <img src={UploadIcon} alt="upload icon" />
    </div>
  );

  const avatarHandleChange = (info) => {
    // for form data
    setImageObj(info.fileList[info.fileList.length - 1].originFileObj);

    // for preview data
    getBase64(
      info.fileList[info.fileList.length - 1].originFileObj,
      (imageUrl) => {
        setImageUrl(imageUrl);
        setLoading(false);
      }
    );
    setTouched(true);
  };

  const removeProfilePhoto = () => {
    // deleteData(
    //   process.env.REACT_APP_PROFILE_PHOTO_DETELTE,
    //   userContextData.token
    // )
    axios({
      method: "delete",
      url: `${process.env.REACT_APP_PROFILE_PHOTO_DETELTE}`,
      // data: bodyFormData,
      headers: {
        Authorization: "Bearer " + userContextData.token,
      },
    })
      .then((res) => {
        if (res.status === 200) {
          Swal.fire({
            title: "Profile Photo Deleted Successfully",
            confirmButtonText: `Continue`,
          });
          // props.setProfilePhoto("");
          props.setProfilePhoto(CompanyPhoto);
          // props.setCompanyName(values.company_name);
          // props.setProfilePhoto(imageUrl);
        }
      })
      .catch((error) => {
        console.log(error);
        return false;
      });

    // if (res.status === 200) {
    //   Swal.fire({
    //     title: "Updated Successfully",
    //     confirmButtonText: `Continue`,
    //   });
    //   // props.setCompanyName(values.company_name);
    //   // props.setProfilePhoto(imageUrl);
    // }

    // for form data
    setImageObj("");
    setImageUrl();

    // props.setCompanyName(values.company_name);
    // props.setProfilePhoto(imageUrl);
    // for preview data
    // getBase64(
    //   info.fileList[info.fileList.length - 1].originFileObj,
    //   (imageUrl) => {
    //     setImageUrl(imageUrl);
    //     setLoading(false);
    //   }
    // );
    setTouched(true);
  };

  const { Option } = Select;
  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  /**
   * Multiple Image upload, preview image
   */
  const [fileList, setFileList] = useState([]);
  const [previewTitle, setPreviewTitle] = useState();
  const [previewImage, setPreviewImage] = useState();
  const [previewVisible, setPreviewVisible] = useState(false);
  const [fileLimit, setFileLimit] = useState(0);

  const fileHandleCancel = () => setPreviewVisible(false);
  const fileHandlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };
  // console.log("ucd:: " + userContextData);

  const fileHandleChange = ({ fileList }) => setFileList(fileList);
  const fileUploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const onRemoveFile = (event) => {
    if(event.name.endsWith('png')){
      deleteData(
      process.env.REACT_APP_PROFILE_ATTACHMENT_IMAGE_DELETE_URL + event.uid,
      // `${"https://dev.tmmim.com/api/vendor/profile/delete-image/"+ event.uid}`,
      userContextData.token
    )
      .then((res) => {
        if (res) {
          return true;
        }
      })
      .catch((error) => {
        console.log(error);
        return false;
      });
    }
    if(event.name.endsWith('mp4')){
      deleteData(
      process.env.REACT_APP_PROFILE_ATTACHMENT_VIDEO_DELETE_URL + event.uid,
      // `${"https://dev.tmmim.com/api/vendor/profile/delete-video/"+ event.uid}`,
      userContextData.token
    )
      .then((res) => {
        if (res) {
          return true;
        }
      })
      .catch((error) => {
        console.log(error);
        return false;
      });
    }

    // deleteData(
    //   process.env.REACT_APP_PROFILE_ATTACHMENT_DELETE_URL + event.uid,
    //   userContextData.token
    // )
    //   .then((res) => {
    //     if (res) {
    //       return true;
    //     }
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //     return false;
    //   });
  };

  /**
   * Form Submission
   */

   const onChangeManageDetailsService = (content) => {
    setManageDetailsServiceLength(editorRef.current.getContent({ format: "text" }).length)
  }

  const onChangeManageDetailsServiceArabic = (content) => {
    setManageDetailsServiceArabicLength(editorRefArabic.current.getContent({ format: "text" }).length)
  }


  useEffect(() => {
        setManageDetailsServiceLength(manageDetailsServiceLength);
        setManageDetailsServiceArabicLength(manageDetailsServiceArabicLength);
  }, [manageDetailsServiceLength,manageDetailsServiceArabicLength]);


  const onFinish = (values) => {
    if(!editorRef.current.getContent({ format: "text" }) || !editorRefArabic.current.getContent({format: "text"})){
      setManageDetailsServiceLength(editorRef.current.getContent({ format: "text" }).length)
      setManageDetailsServiceArabicLength(editorRefArabic.current.getContent({ format: "text" }).length)
      return;

    }else{
    
      setComplete(true);
      const bodyFormData = new FormData();
      bodyFormData.append('company_name', values.company_name);
      bodyFormData.append('company_address', values.company_address);
      bodyFormData.append('country', Number(values.country));
      bodyFormData.append('city', Number(values.city));
      bodyFormData.append('area', values.area);
      bodyFormData.append('zip_code', Number(values.zip_code));
      bodyFormData.append('terms_and_conditions', values.terms_and_conditions);
      bodyFormData.append('terms_and_conditions_arabic', values.terms_and_conditions_arabic);
      bodyFormData.append('service_details', editorRef.current.getContent());
      bodyFormData.append('service_details_arabic', editorRefArabic.current.getContent());
      bodyFormData.append('price', Number(values.price));
      bodyFormData.append('map_location', values.map_location);
      bodyFormData.append('location_direction', values.map_location_direction);
      if (userContextData.plan === 'premium') {
        bodyFormData.append('discount_amount', Number(values.discount_amount));
        bodyFormData.append('discount_details', values.discount_details);
        bodyFormData.append(
          'discount_end_date',
          moment(values.discount_end_date).format('YYYY-MM-DDThh:mm')
        );
      }
      if (touched) {
        bodyFormData.append('profile_photo', imageObj);
      }
      
      const submittedFileList = fileList.slice(fileCount);
      submittedFileList.forEach((file, index) => {
        const key = 'attachments[' + index + ']path';
        bodyFormData.append(key, file.originFileObj);
      });

      axios({
        method: 'post',
        url: `${process.env.REACT_APP_PROFILE_UPDATE_URL}`,
        data: bodyFormData,
        headers: {
          Authorization: 'Bearer ' + userContextData.token,
        },
      })
        .then((res) => {
          setComplete(false);
          if (res.status === 200) {
            Swal.fire({
              title: 'Updated Successfully',
              confirmButtonText: `Continue`,
            });
            props.setCompanyName(values.company_name);
            props.setProfilePhoto(imageUrl ? imageUrl : CompanyPhoto);
          }
        })
        .catch((e) => {
          setComplete(false);
          console.log(e);
        });
      }
  };

  /**
   *
   * Set Form initial Data after getting response
   */
  const onFill = (profileData) => {
    console.log(profileData);
    form.setFieldsValue({
      company_name: profileData.data.company_name,
      company_address: profileData.data.company_address,
      country: profileData.data.country,
      city: profileData.data.city,
      area: profileData.data.area,
      zip_code: profileData.data.zip_code,
      terms_and_conditions: profileData.data.terms_and_conditions,
      terms_and_conditions_arabic: profileData.data.terms_and_conditions_arabic,
      price: profileData.data.price,
      map_location: profileData.data.map_location,
      map_location_direction: profileData.data.location_direction,
      discount_amount:
        userContextData.plan === "free" ? 0 : profileData.data.discount_amount,
      discount_end_date: moment(profileData.discount_end_date),
      discount_details: userContextData.plan === "free" ? "" : profileData.data.discount_details,
    });
    setEditorValue(profileData.data.service_details);
    setEditorValueArabic(profileData.data.service_details_arabic);
    setImageUrl(profileData.data.profile_photo);
    props.setProfilePhoto(
      profileData.data.profile_photo
        ? profileData.data.profile_photo
        : CompanyPhoto
    );
    let imageAndVideo = [];
    // let attachments = [];
    // if (
    //   profileData.data.attachments &&
    //   profileData.data.attachments.length > 0
    // ) {
    //   profileData.data.attachments.forEach((attachment, index) => {
    //     const data = {
    //       uid: attachment.id,
    //       name: `image_${index + 1}.png`,
    //       status: "done",
    //       url: attachment.path,
    //     };
    //     attachments.push(data);
    //   });
    // }

    if(profileData.data.image && profileData.data.image.length > 0){
      profileData.data.image.forEach((image, index) => {
        const data = {
          uid: image.id,
          name: `image_${index + 1}.png`,
          status: "done",
          url: image.image,
        };
        imageAndVideo.push(data);
      });
    }
    if(profileData.data.video && profileData.data.video.length > 0){
      profileData.data.video.forEach((video, index) => {
        const data = {
          uid: video.id,
          name: `video_${index + 1}.mp4`,
          status: "done",
          url: video.video,
        };
        imageAndVideo.push(data);
      });
    }

    setFileList(imageAndVideo);
    // setFileList(attachments);
    setFileCount((prevCount) => {
      return prevCount + imageAndVideo.length;
    });
  };

  const handleCountryOnChangeEvent = (value) => {
    form.setFieldsValue({ city: null });
    if (value) {
      const filteredList = cityList.filter(
        (element) => element.country === parseInt(value)
      );
      setFilteredCityList(filteredList);
    }
  };


  useEffect(() => {
    setFetchedProfileData(true);
    const token = localStorage.getItem("token");
    Promise.all([
      getData(
        process.env.REACT_APP_PROFILE_GET_URL + "/" + userContextData.userId,
        token
      ),
      getDataWithoutToken(process.env.REACT_APP_COUNTRY_URL),
    ])
      .then(([res1, res2]) => Promise.all([res1, res2]))
      .then(([data1, data2]) => {
        setFetchedProfileData(false);
        setCountryList(data2.data.countryList);
        setCityList(data2.data.cityList);
        const filteredList = data2.data.cityList.filter(
          (element) => element.country === parseInt(data1.data.country)
        );
        setFilteredCityList(filteredList);
        onFill(data1);
      })
      .catch((e) => {
        console.log(e);
      });
    // if (userContextData.plan === "free") {
    //   setFileLimit(6);
    // } else {
    //   setFileLimit(20);
    // }
  }, []);


  return (
    <ContainerDiv>
      <div className={"text-" + changeAlignment}>
        <TitleComponent title={t("update-details-page-title")} />
      </div>

      {fetchedProfileData ? (
        <div style={{ marginTop: "20%" }}>
          <SpinnerComponent />
        </div>
      ) : (
        <>
          <div className="pt-5">
            <Form
              dir={changeAlignment === "right" ? "rtl" : "ltr"}
              className="dashboard-box-shadow p-4"
              form={form}
              name="control-hooks"
              onFinish={onFinish}
            >
              <div className="form-row ">
                <div className="form-group col-sm profileImage ">
                  <Form.Item
                    name="profile_pic"
                    getValueFromEvent={({ file }) => file.originFileObj}
                  >
                    <Upload
                      name="avatar"
                      listType="picture-card"
                      className="avatar-uploader "
                      showUploadList={false}
                      beforeUpload={() => false}
                      onChange={avatarHandleChange}
                    >
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt="avatar"
                          style={{
                            width: "100%",
                            height: "100%",
                            borderRadius: "50%",
                          }}
                        />
                      ) : (
                        <img
                          src={UpdateProfile}
                          alt="avatar"
                          style={{
                            width: "100%",
                            height: "100%",
                            borderRadius: "50%",
                          }}
                        />
                      )}
                    </Upload>
                    <div
                      className={
                        "upload-profile-photo-text" +
                        (imageUrl ? " d-none" : "")
                      }
                    >
                      {t("update-details-upload-photo")}
                    </div>
                    <div className={imageUrl ? "" : " d-none"}>
                      <Button type="text" onClick={removeProfilePhoto}>
                        <span className="upload-profile-photo-text ">
                          {t("update-details-remove-photo")}
                        </span>
                      </Button>
                    </div>
                  </Form.Item>
                </div>
              </div>

              <div className="form-group">
                <label for="name" className="field-label">
                  {t("update-details-company-name")}
                </label>
                <div className="mb-4">
                  <Form.Item
                    name="company_name"
                    rules={[
                      {
                        required: true,
                        message: (
                          <ValidateMessageComponent
                            message={"Company Name is required."}
                          />
                        ),
                      },
                    ]}
                  >
                    <Input
                      size="large"
                      // placeholder="Stoney Creek Hotel & Conference Center - La Crosse"
                      placeholder={t("update-details-company-name")}
                      prefix={
                        <img
                          className="mx-1"
                          src={HomeIcon}
                          alt="avatar"
                          style={{ width: "1rem" }}
                        />
                      }
                    />
                  </Form.Item>
                </div>
              </div>

              <div className="form-group">
                <label for="name" className="field-label">
                  {t("update-details-company-address")}
                </label>
                <div className="mb-4">
                  <Form.Item
                    name="company_address"
                    rules={[
                      {
                        required: true,
                        message: (
                          <ValidateMessageComponent
                            message={"Company Address is required."}
                          />
                        ),
                      },
                    ]}
                  >
                    <Input
                      size="large"
                      // placeholder="Hotel Weddings - Cambridge, MA"
                      placeholder={t("update-details-company-address")}
                      prefix={
                        <img
                          className="mx-1"
                          src={LocationIcon}
                          alt="avatar"
                          style={{ width: "1rem" }}
                        />
                      }
                    />
                  </Form.Item>
                </div>
              </div>

              <div className=" form-group row">
                <div className="col-md-6">
                  <label for="country" className="field-label">
                    {t("update-details-country")}
                  </label>
                  <div className="mb-4">
                    <Form.Item
                      // dir="rtl"
                      name="country"
                      rules={[
                        {
                          required: true,
                          message: (
                            <ValidateMessageComponent
                              message={"Country is required ."}
                            />
                          ),
                        },
                      ]}
                    >
                      <Select
                        name="country"
                        id="country"
                        size="large"
                        // showSearch
                        style={{ width: "100%" }}
                        placeholder="Santa Ana"
                        optionFilterProp="children"
                        onChange={handleCountryOnChangeEvent}
                        // filterOption={(input, option) =>
                        //   option.children
                        //     .toLowerCase()
                        //     .indexOf(input.toLowerCase()) >= 0
                        // }
                      >
                        {countryList.map((d, index) => (
                          <option value={d.id} key={index}>
                            <img
                              className="mr-2"
                              src={LocationIcon}
                              alt="location"
                              style={{ width: "1rem" }}
                            />
                            {d.name}
                          </option>
                        ))}
                      </Select>
                    </Form.Item>
                  </div>
                </div>
                <div className="col-md-6">
                  <label for="city" className="field-label">
                    {t("update-details-city")}
                  </label>
                  <div className="mb-4">
                    <Form.Item
                      name="city"
                      rules={[
                        {
                          required: true,
                          message: (
                            <ValidateMessageComponent
                              message={"City is required."}
                            />
                          ),
                        },
                      ]}
                    >
                      <Select
                        name="city"
                        id="city"
                        size="large"
                        // showSearch
                        style={{ width: "100%" }}
                        placeholder="Santa Ana"
                        optionFilterProp="children"
                        // filterOption={(input, option) =>
                        //   option.children
                        //     .toLowerCase()
                        //     .indexOf(input.toLowerCase()) >= 0
                        // }
                      >
                        {/* <img
                          className="mx-1"
                          src={LocationIcon}
                          alt="avatar"
                          style={{ width: '1rem' }}
                        /> */}
                        {filteredCityList.map((d, index) => (
                          <Option value={d.id} key={index}>
                            <img
                              className="mr-2"
                              src={LocationIcon}
                              alt="avatar"
                              style={{ width: "1rem" }}
                            />
                            {d.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </div>
                </div>
              </div>

              <div className="form-group row">
                <div className="col-md-6">
                  <label for="area" className="field-label">
                    {t("update-details-area")}
                  </label>
                  <div className="mb-4">
                    <Form.Item
                      name="area"
                      rules={[
                        {
                          required: true,
                          message: (
                            <ValidateMessageComponent
                              message={"Area is required."}
                            />
                          ),
                        },
                      ]}
                    >
                      <Input
                        size="large"
                        // placeholder="Illinois"
                        placeholder={t("update-details-area")}
                        prefix={
                          <img
                            className="mx-1"
                            src={LocationIcon}
                            alt="avatar"
                            style={{ width: "1rem" }}
                          />
                        }
                      />
                    </Form.Item>
                  </div>
                </div>
                <div className="col-md-6">
                  <label for="zip_code" className="field-label">
                    {t("update-details-zip-code")}
                  </label>
                  <div className="mb-4">
                    <Form.Item
                      name="zip_code"
                      type="number"
                      rules={[
                        {
                          required: true,
                          message: (
                            <ValidateMessageComponent
                              message={"Zip code is required."}
                            />
                          ),
                        },
                        {
                          pattern: new RegExp(/^[0-9]+$/),
                          message: (
                            <ValidateMessageComponent
                              message={"Zip code is not valid."}
                            />
                          ),
                        },
                      ]}
                    >
                      <Input
                        size="large"
                        // placeholder="85846"
                        placeholder={t("update-details-zip-code")}
                        prefix={
                          <img
                            className="mx-1"
                            src={StateCodeIcon}
                            alt="avatar"
                            style={{ width: "1rem" }}
                          />
                        }
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group col-sm">
                  <label
                    htmlFor="services"
                    className={
                      changeAlignment == "right"
                        ? "d-block text-right"
                        : "d-block text-left"
                    }
                  >
                    {t("update-details-manage-service-details") + " "}

                    <Tooltip placement="top" title={serviceDetailsText}>
                      <span className="fa fa-exclamation-circle pl-2"></span>
                    </Tooltip>
                  </label>
                  <Editor
                    onInit={(evt, editor) => (editorRef.current = editor)}
                    initialValue={editorValue}
                    onEditorChange={onChangeManageDetailsService}
                    // placeholder={t("update-details-manage-service-details")}
                    init={{
                      height: 200,
                      menubar: false,
                      directionality:
                        changeAlignment === "right" ? "rtl" : "ltr",
                      plugins: [
                        "advlist autolink lists link image charmap print preview anchor",
                        "searchreplace visualblocks code fullscreen",
                        "insertdatetime media table paste code help wordcount stylebuttons",
                      ],
                      toolbar:
                        "bold formatselect alignleft aligncenter alignright alignjustify",
                    }}
                  />

                  {manageDetailsServiceLength === 0 ? <div style={{color:'red'}}>{t("manage-details-service-is-required")}</div> : <div></div>}
                  
                </div>
              </div>

              <div className="form-row">
                <div className="form-group col-sm">
                  <label
                    htmlFor="service_details_arabic"
                    className={
                      changeAlignment == "right"
                        ? "d-block text-right"
                        : "d-block text-left"
                    }
                  >
                    {t("update-details-manage-service-details-arabic") + " "}

                    <Tooltip placement="top" title={serviceDetailsText}>
                      <span className="fa fa-exclamation-circle pl-2"></span>
                    </Tooltip>
                  </label>
                  <Editor
                    onInit={(evt, editor) => (editorRefArabic.current = editor)}
                    initialValue={editorValueArabic}
                    onEditorChange={onChangeManageDetailsServiceArabic}
                    // placeholder={t('update-details-manage-service-details-arabic')}
                    init={{
                      height: 200,
                      menubar: false,
                      directionality: "rtl",
                      // changeAlignment === 'rtl' ? 'rtl' : 'ltr',
                      plugins: [
                        "advlist autolink lists link image charmap print preview anchor",
                        "searchreplace visualblocks code fullscreen",
                        "insertdatetime media table paste code help wordcount stylebuttons",
                      ],
                      toolbar:
                        "bold formatselect alignleft aligncenter alignright alignjustify",
                    }}
                  />

                {manageDetailsServiceArabicLength === 0 ? <div style={{color:'red'}}>{t("manage-details-service-arabic-is-required")}</div> : <div></div>}

                </div>
              </div>

              <div className="form-group mt-3">
                <label
                  htmlFor="terms_conditions"
                  className={
                    changeAlignment == "right"
                      ? "d-block text-right"
                      : "d-block text-left"
                  }
                >
                  {t("update-details-terms-conditions")}
                </label>
                <Form.Item name="terms_and_conditions">
                  <TextArea
                    // placeholder={t("update-details-terms-conditions")}
                    autoSize={{ minRows: 3, maxRows: 5 }}
                  />
                </Form.Item>
              </div>

              <div className="form-group mt-3">
                <label
                  htmlFor="terms_and_conditions_arabic"
                  className={
                    changeAlignment == "right"
                      ? "d-block text-right"
                      : "d-block text-left"
                  }
                >
                  {t("update-details-terms-conditions-arabic")}
                </label>
                <Form.Item name="terms_and_conditions_arabic" dir="rtl">
                  <TextArea
                    // placeholder={t('update-details-terms-conditions-arabic')}
                    autoSize={{ minRows: 3, maxRows: 5 }}
                  />
                </Form.Item>
              </div>

              <div className="form-row">
                <div
                  className={
                    "form-group col-sm text-" +
                    (changeAlignment === "right" ? "right" : "left")
                  }
                >
                  <label>
                    {t("update-details-upload-image-video") + " "}

                    <Tooltip placement="top" title={uploadImagesVideosText}>
                      <span className="fa fa-exclamation-circle pl-2"></span>
                    </Tooltip>
                  </label>
                  <Upload
                    listType="picture-card"
                    fileList={fileList}
                    onChange={fileHandleChange}
                    onRemove={onRemoveFile}
                    showUploadList={{
                      showPreviewIcon: false,
                    }}
                  >
                    {fileList.length >= userContextData.mediaNumber
                      ? null
                      : uploadButton}
                  </Upload>
                  <Modal
                    visible={previewVisible}
                    title={previewTitle}
                    footer={null}
                    onCancel={fileHandleCancel}
                  >
                    <img
                      alt="example"
                      style={{ width: "100%" }}
                      src={previewImage}
                    />
                  </Modal>
                </div>
              </div>
              <div className="form-group">
                <label for="map-location" className="field-label">
                  {t("update-details-map-location")}
                </label>
                <div className="mb-4">
                  <Form.Item
                    name="map_location"
                    rules={[
                      {
                        required: true,
                        message: (
                          <ValidateMessageComponent
                            message={"Map Location is required."}
                          />
                        ),
                      },
                    ]}
                  >
                    <Input
                      size="large"
                      placeholder={t("update-details-map-location")}
                      prefix={
                        <img
                          className="mx-1"
                          src={LocationIcon}
                          alt="avatar"
                          style={{ width: "1rem" }}
                        />
                      }
                    />
                  </Form.Item>
                </div>
              </div>
              <div className="form-group">
                <label for="map-location" className="field-label">
                  {t("update-details-map-location-direction")}
                </label>
                <div className="mb-4">
                  <Form.Item
                    name="map_location_direction"
                    rules={[
                      {
                        required: true,
                        message: (
                          <ValidateMessageComponent
                            message={"Map Location is required."}
                          />
                        ),
                      },
                    ]}
                  >
                    <Input
                      size="large"
                      // placeholder="https://goo.gl/maps/Y8Y2zvfM8e"
                      placeholder={t("update-details-map-location-direction")}
                      prefix={
                        <img
                          className="mr-1"
                          src={LocationIcon}
                          alt="avatar"
                          style={{ width: "1rem" }}
                        />
                      }
                    />
                  </Form.Item>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group col-sm-6">
                  <label for="price" className="field-label">
                    {t("update-details-price")}
                  </label>
                  <div className="mb-4">
                    <Form.Item name="price">
                      <Input
                        prefix={
                          <img
                            className="mx-1"
                            src={PriceIcon}
                            alt="avatar"
                            style={{ width: "1.1rem" }}
                          />
                        }
                        placeholder={t("update-details-price")}
                        type="number"
                        size="large"
                        style={{ width: "100%" }}
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group col-sm-6">
                  <label for="discount" className="field-label">
                    {t("update-details-discount") + " "}
                    <Tooltip placement="top" title={discountText}>
                      <span className="fa fa-exclamation-circle pl-2 pt-1"></span>
                    </Tooltip>
                  </label>
                  <div className="mb-4">
                    <img
                      className="ml-3"
                      src={DiscountIcon}
                      alt="avatar"
                      style={{
                        width: ".9rem",
                        position: "absolute",
                        zIndex: "1",
                        marginTop: "11px",
                      }}
                    />
                    <Form.Item name="discount_amount">
                      <InputNumber
                        // prefix={
                        //   <img
                        //     className="mx-1"
                        //     src={DiscountIcon}
                        //     alt="avatar"
                        //     style={{ width: '.9rem' }}
                        //   />
                        // }
                        // suffix={'%'}
                        maxLength="3"
                        min={0}
                        max={100}
                        maxLength={4}
                        formatter={(value) => `${value}%`}
                        parser={(value) => value.replace("%", "")}
                        style={{ width: "100%", paddingLeft: "28px" }}
                        size="large"
                        disabled={
                          userContextData.plan === "free" &&
                          userContextData.adminPrivileges === "False"
                            ? true
                            : false
                        }
                      />
                      {/* <Input
                        prefix={
                          <img
                            className="mx-1"
                            src={DiscountIcon}
                            alt="avatar"
                            style={{ width: '.9rem' }}
                          />
                        }
                        placeholder={t('update-details-discount')}
                        min={0}
                        max={100}
                        type="number"
                        style={{ width: '100%' }}
                        size="large"
                        disabled={
                          userContextData.plan === 'free' &&
                          userContextData.adminPrivileges === 'False'
                            ? true
                            : false
                        }
                      /> */}
                    </Form.Item>
                  </div>
                </div>
                <div className="form-group col-sm-6">
                  <label for="discount-date" className="field-label">
                    {t("update-details-discount-date")}
                  </label>
                  <div className="mb-4">
                    <Form.Item name="discount_end_date">
                      <DatePicker
                        size="large"
                        style={{ width: "100%" }}
                        disabled={
                          userContextData.plan === "free" &&
                          userContextData.adminPrivileges === "False"
                            ? true
                            : false
                        }
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label
                  for="update-profile-details-id"
                  className={
                    changeAlignment == "right"
                      ? "d-block text-right"
                      : "d-block text-left"
                  }
                >
                  {t("update-details-discount-details")}
                </label>
                <Form.Item name="discount_details">
                  <TextArea
                    // placeholder={t("update-details-discount-details")}
                    autoSize={{ minRows: 3, maxRows: 5 }}
                    disabled={
                      userContextData.plan === "free" &&
                      userContextData.adminPrivileges === "False"
                        ? true
                        : false
                    }
                  />
                </Form.Item>
              </div>
              <div>{complete ? <LoadingComponent /> : <></>}</div>
              <div className="row">
                <div className="col-md-4">
                  <div
                    className={
                      "space " +
                      (changeAlignment == "right"
                        ? "d-flex flex-content-right"
                        : "")
                    }
                  >
                    <ButtonComponent
                      text={t("update-details-update-button")}
                      outline="no"
                    />
                  </div>
                </div>
              </div>
            </Form>
          </div>
        </>
      )}
    </ContainerDiv>
  );
};

export default UpdateProfileComponent;
