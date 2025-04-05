

import os
import json

def convert_to_training_format(original_json):
    return {
        "prompt": f"Facts: {'; '.join(original_json['facts'])} | IPC: {', '.join(original_json['ipc_sections'])}",
        "completion": json.dumps({
            "prosecution": [{"argument": arg["argument"], "precedents": arg["precedents"]} 
                            for arg in original_json["prosecution_arguments"]],
            "defense": [{"argument": arg["argument"], "precedents": arg["precedents"]} 
                        for arg in original_json["defense_arguments"]]
        })
    }


def process_json_files(input_folder, output_folder):
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)
    for filename in os.listdir(input_folder):
        print(filename)
        if filename.endswith(".json"):
            input_path = os.path.join(input_folder, filename)
            output_path = os.path.join(output_folder, filename)
            
            with open(input_path, "r", encoding="utf-8") as file:
                original_json = json.load(file)
            
            converted_data = convert_to_training_format(original_json)
            
            with open(output_path, "w", encoding="utf-8") as file:
                json.dump(converted_data, file, indent=4)
            
            print(f"Processed: {filename}")




def merge_json_files(output_folder, merged_file):
    with open(merged_file, "w", encoding="utf-8") as outfile:
        for output in output_folder:
            for filename in os.listdir(output):
                if filename.endswith(".json"):
                    file_path = os.path.join(output, filename)
                    with open(file_path, "r", encoding="utf-8") as infile:
                        json_data = json.load(infile)
                        outfile.write(json.dumps(json_data) + "\n")
    print(f"Merged all JSON files into {merged_file}")


input_folder = "case_outputs_ipc_498a"  # Change this to your actual input folder
output_folder = ['case_outputs_ipc_498a_output', 'case_outputs_ipc_354a_output', 'case_outputs_ipc_302_output']  # Change this to your desired output folder
merged_file = "./merged_output.jsonl"  # Change this to your desired merged output file


merge_json_files(output_folder, merged_file)



