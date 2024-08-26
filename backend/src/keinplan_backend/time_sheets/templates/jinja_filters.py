"""Module for custom Jinja filters."""

from typing import Dict


def escape_latex(inputStr: str) -> str:
    """Sanitize input for use in LaTeX templates by escaping special chars."""
    specialCharMap: Dict[str, str] = {
        "'": r"\textquotesingle{}",
        '"': r"\textquotedbl{}",
        "`": r"\textasciigrave{}",
        "^": r"\textasciicircum{}",
        "~": r"\textasciitilde{}",
        "<": r"\textless{}",
        ">": r"\textgreater{}",
        "|": r"\textbar{}",
        "\\": r"\textbackslash{}",
        "{": r"\{",
        "}": r"\}",
        "$": r"\$",
        "&": r"\&",
        "#": r"\#",
        "_": r"\_",
        "%": r"\%",
    }
    # Iterate over each character to avoid replacing control commands more than once
    result: str = ""
    for char in inputStr:
        result += specialCharMap.get(char, char)
    return result
