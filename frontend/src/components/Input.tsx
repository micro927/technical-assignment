import {
  FieldValues,
  UseControllerProps,
  useController,
} from 'react-hook-form';

function Input<FormValues extends FieldValues>(
  props: UseControllerProps<FormValues> & {
    label?: string;
    type?: React.HTMLInputTypeAttribute;
  },
) {
  const { field, fieldState } = useController(props);
  const { label, type } = props;
  return (
    <div>
      {label && <label>{label}</label>}
      <input type={type ?? 'text'} {...field} placeholder={props.name} />
      <p>{fieldState.isTouched && 'Touched'}</p>
      <p>{fieldState.isDirty && 'Dirty'}</p>
      <p>{fieldState.invalid ? 'invalid' : 'valid'}</p>
    </div>
  );
}

export default Input;
